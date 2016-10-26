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
    public function findAllAction($team)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Shift");

        $timestamp = strtotime('monday this week');
        $mondayThisWeek = date_timestamp_set(new \DateTime(), $timestamp);

        $timestamp2 = strtotime('sunday this week +3 weeks');
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
                    $shift->setDescription($shiftType->getDescription());
                    $shift->setStartTime($shiftType->getDefaultStartTime());
                    $shift->setEndTime($shiftType->getDefaultEndTime());
                    $shift->setHome($item->home);
//                    $shift->setBreakDuration($shiftType->getBreakDuration());

                    if ($item->description != null) {
                        $shift->setDescription($item->description);
                    }

                } else {
                    $shift = new Shift();
                    $shift->setUserFk($user);
                    $shift->setShiftTypeFk($shiftType);
                    $shift->setDescription($item->description);
                    $shift->setStartTime($shiftType->getDefaultStartTime());
                    $shift->setEndTime($shiftType->getDefaultEndTime());
                    $shift->setDate(new \DateTime($date));
                    $shift->setHome($item->home);
//                    $shift->setBreakDuration($shiftType->getShiftDuration());

                    if ($item->description != null) {
                        $shift->setDescription($item->description);
                    }

                    $em->persist($shift);

                }
            }

            $em->flush();

            $data = $this->get('serializer')->serialize(array("result" => true), 'json');
            return new Response($data, 200, ['Content-Type' => 'application/json']);
        }
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

        $shifts = $repository->findShiftsByUser($user->getId(), new \DateTime());

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


}
