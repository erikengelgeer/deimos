<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Shift;
use AppBundle\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

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

        // mktime (0,0,0, M, D, Y)
        $timestamp = strtotime('monday this week', mktime(0,0,0, $startDate->format('m'), $startDate->format('d'), $startDate->format('Y')));
        $mondayThisWeek = date_timestamp_set(new \DateTime(), $timestamp);

        $strDate = 'sunday this week +' . ($weeks - 1) . ' weeks';
        $timestamp2 = strtotime($strDate, mktime(0,0,0, $startDate->format('m'), $startDate->format('d'), $startDate->format('Y')));
        $fourWeeksLater = date_timestamp_set(new \DateTime(), $timestamp2);

        $shifts = $repository->findPlanning($mondayThisWeek, $fourWeeksLater, $team);

        $processedData = [];
        $tasks = [];
        $previousId = 0;

        foreach ($shifts as $shift) {
            if ($previousId == $shift['id']) continue;

            $previousId = $shift['id'];

            foreach ($shifts as $otherShift) {
                if ($shift['id'] == $otherShift['id']) {

                    $newShift = [];

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
     */
    function addAction(Request $request)
    {
        $data = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();


        foreach ($data->selectedDates as $date) {



            foreach ($data->shifts as $item) {
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
     */
    function findAllByUser(User $user)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('AppBundle:Shift');

        $today = new \DateTime();
        $aMonthAgo = ($today->format('Y') - 1) . "-" . ($today->format('m')) . "-1";

        $shifts = $repository->findShiftsByUser($user->getId(), new \DateTime($aMonthAgo));

        $data = $this->get('serializer')->serialize($shifts, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/user/{id}/{date}")
     * @Method("GET")
     */
    function findByUserAndDate(User $user, $date)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('AppBundle:Shift');

        $shifts = $repository->findOneBy(array('userFk' => $user, 'date' => new \DateTime($date)));

        $data = $this->get('serializer')->serialize($shifts, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("PUT")
     *
     * Get a single shift
     */
    public function updateAction(Shift $shift, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $content = json_decode($request->getContent());

        $shift->setStartTime(new \DateTime(date('Y-m-d H:i', ($content->setStartTime/1000))));
        $shift->setEndTime(new \DateTime(date('Y-m-d H:i', ($content->setEndTime/1000))));
        $shift->setHome($content->home);

        $em->flush();

        $data = $this->get('serializer')->serialize($shift, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

}
