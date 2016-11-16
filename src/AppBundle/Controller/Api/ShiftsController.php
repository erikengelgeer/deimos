<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Shift;
use AppBundle\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * @Route("api/shifts")
 */
class ShiftsController extends Controller
{
    /**
     * @Route("/{team}")
     * @Method("GET")
     *
     * Get all the shifts
     */
    public function findAllAction($team, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Shift");

        $params = $request->query;
        $startDate = new \DateTime($params->get('startDate'));
        $weeks = $params->get('weeks');
        $timezone = $params->get('timezone');

        // mktime (0,0,0, M, D, Y)
        $timestamp = strtotime('monday this week', mktime(0, 0, 0, $startDate->format('m'), $startDate->format('d'), $startDate->format('Y')));
        $mondayThisWeek = date_timestamp_set(new \DateTime(), $timestamp);

        $strDate = 'sunday this week +' . ($weeks - 1) . ' weeks';
        $timestamp2 = strtotime($strDate, mktime(0, 0, 0, $startDate->format('m'), $startDate->format('d'), $startDate->format('Y')));
        $fourWeeksLater = date_timestamp_set(new \DateTime(), $timestamp2);

        $shifts = $repository->findPlanning($mondayThisWeek, $fourWeeksLater, $team);

        $processedData = [];
        $tasks = [];
        $previousId = 0;

        foreach ($shifts as $shift) {
            if ($previousId == $shift['id']) continue;

            $previousId = $shift['id'];

            $startTime = new \DateTime($shift['startTime']->format('H:i:s'), new \DateTimeZone('UTC'));
            $shift['startTime'] = $startTime->setTimezone(new \DateTimeZone($timezone));

            $endTime = new \DateTime($shift['endTime']->format('H:i:s'), new \DateTimeZone('UTC'));
            $shift['endTime'] = $endTime->setTimezone(new \DateTimeZone($timezone));

            if ($shift['startTime']->format('Z') / 3600 > 0) {
                $shift['timezoneOffset'] = "+" . strval($shift['startTime']->format('Z') / 3600);
            } else {
                $shift['timezoneOffset'] = strval($shift['startTime']->format('Z') / 3600);
            }


            foreach ($shifts as $otherShift) {
                if ($shift['id'] == $otherShift['id']) {

                    $newShift = [];

                    if($otherShift['taskStartTime'] != null) {
                        $startTime = new \DateTime($otherShift['taskStartTime']->format('H:i:s'), new \DateTimeZone('UTC'));
                        $otherShift['taskStartTime'] = $startTime->setTimezone(new \DateTimeZone($timezone));
                    }

                    if($otherShift['taskEndTime'] != null) {
                        $endTime = new \DateTime($otherShift['taskEndTime']->format('H:i:s'), new \DateTimeZone('UTC'));
                        $otherShift['taskEndTime'] = $endTime->setTimezone(new \DateTimeZone($timezone));
                    }

                    $newShift['taskId'] = $otherShift['taskId'];
                    $newShift['taskDescription'] = $otherShift['taskDescription'];
                    $newShift['taskStartTime'] = $otherShift['taskStartTime'];
                    $newShift['taskEndTime'] = $otherShift['taskEndTime'];
                    $newShift['taskUrl'] = $otherShift['taskUrl'];

                    array_push($tasks, $newShift);
                }
            }

            unset($shift['taskId']);
            unset($shift['taskDescription']);
            unset($shift['taskStartTime']);
            unset($shift['taskEndTime']);
            unset($shift['taskUrl']);

            array_push($processedData, [$shift, $tasks]);
            $tasks = [];

        }

        $data = $this->get('serializer')->serialize($processedData, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/")
     * @Method("POST")
     *
     * Add a new shift
     */
    function addAction(Request $request)
    {
        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();

        foreach ($content->selectedDates as $date) {


            foreach ($content->shifts as $item) {
                $user = $em->getRepository('AppBundle:User')->find($item->userId);
                $shiftType = $em->getRepository('AppBundle:ShiftType')->find($item->shiftId);

                $shift = $em->getRepository('AppBundle:Shift')->findOneBy(array('date' => new \DateTime($date), 'userFk' => $user));

                if ($shift != null) {
                    $shift->setShiftTypeFk($shiftType);
                    $shift->setStartTime($shiftType->getDefaultStartTime());
                    $shift->setEndTime($shiftType->getDefaultEndTime());
                    (isset($item->home)) ? $shift->setHome($item->home) : $shift->setHome(0);
                    (isset($item->description)) ? $shift->setDescription($item->description) : $shift->setDescription($shiftType->getDescription());

                } else {
                    $shift = new Shift();
                    $shift->setUserFk($user);
                    $shift->setShiftTypeFk($shiftType);
                    $shift->setStartTime($shiftType->getDefaultStartTime());
                    $shift->setEndTime($shiftType->getDefaultEndTime());
                    $shift->setDate(new \DateTime($date));
                    (isset($item->home)) ? $shift->setHome($item->home) : $shift->setHome(0);
                    (isset($item->description)) ? $shift->setDescription($item->description) : $shift->setDescription($shiftType->getDescription());

                    $em->persist($shift);

                }
                $em->flush();
            }

        }

        $data = $this->get('serializer')->serialize(array("result" => true), 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a single shift
     */
    public function findOneByAction(Shift $shift)
    {
        $data = $this->get('serializer')->serialize($shift, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/user/{id}")
     * @Method("GET")
     *
     * Get all shifts by users
     */
    function findAllByUser(User $user, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('AppBundle:Shift');

        $params = $request->query;
        $timezone = $params->get('timezone');

        $today = new \DateTime();
        $aMonthAgo = ($today->format('Y') - 1) . "-" . ($today->format('m')) . "-1";

        $shifts = $repository->findShiftsByUser($user->getId(), new \DateTime($aMonthAgo));

        $newShifts = [];

        foreach ($shifts as $shift) {
            $date = new \DateTime($shift['date']->format('Y-m-d H:i:s'), new \DateTimeZone($timezone));
            $shift['date'] = $date;

            array_push($newShifts, $shift);
        }

        $shifts = $newShifts;

        $data = $this->get('serializer')->serialize($shifts, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/user/{id}/{date}")
     * @Method("GET")
     *
     * Get all shifts by user and date
     */
    function findByUserAndDate(User $user, $date, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('AppBundle:Shift');

        $params = $request->query;
        $timezone = $params->get('timezone');

        $shift = $repository->findOneBy(array('userFk' => $user, 'date' => new \DateTime($date)));

        $startTime = new \DateTime($shift->getStartTime()->format('Y-m-d H:i:s'), new \DateTimeZone('UTC'));
        $endTime = new \DateTime($shift->getEndTime()->format('Y-m-d H:i:s'), new \DateTimeZone('UTC'));

        $startTime->setTimezone(new \DateTimeZone($timezone));
        $endTime->setTimezone(new \DateTimeZone($timezone));

        $shift->setStartTime($startTime);
        $shift->setEndTime($endTime);

        if ($startTime->format('Z') / 3600 > 0) {
            $shift->setTimezoneOffset("+" . strval($startTime->format('Z') / 3600));
        } else {
            $shift->setTimezoneOffset(strval($startTime->format('Z') / 3600));
        }

        foreach ($shift->getTasks() as $task) {
            $shift->removeTask($task);

            $startTime = new \DateTime($task->getStartTime()->format('Y-m-d H:i:s'), new \DateTimeZone('UTC'));
            $endTime = new \DateTime($task->getEndTime()->format('Y-m-d H:i:s'), new \DateTimeZone('UTC'));

            $startTime->setTimezone(new \DateTimeZone($timezone));
            $endTime->setTimezone(new \DateTimeZone($timezone));

            $task->setStartTime($startTime);
            $task->setEndTime($endTime);

            $shift->addTask($task);
        }

        $data = $this->get('serializer')->serialize($shift, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("PUT")
     *
     * Update a single shift
     */
    public function updateAction(Shift $shift, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $content = json_decode($request->getContent());

        $params = $request->query;
        $timezone = $params->get('timezone');

        if ($content->wholeDay) {
            $shift->setStartTime(new \DateTime("1970-01-01 00:00:00", new \DateTimeZone($timezone)));
            $shift->setEndTime(new \DateTime("1970-01-01 23:59:59", new \DateTimeZone($timezone)));
        } else {
            $shift->setStartTime(new \DateTime("1970-01-01 " . $content->startTime, new \DateTimeZone($timezone)));
            $shift->setEndTime(new \DateTime("1970-01-01 " . $content->endTime, new \DateTimeZone($timezone)));
        }

        $shift->setStartTime($shift->getStartTime()->setTimezone(new \DateTimeZone('UTC')));
        $shift->setEndTime($shift->getEndTime()->setTimezone(new \DateTimeZone('UTC')));

        $shift->setHome($content->home);
        $em->flush();

        $data = $this->get('serializer')->serialize($shift, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

}
