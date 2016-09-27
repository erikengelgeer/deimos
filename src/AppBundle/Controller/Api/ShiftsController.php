<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Shift;
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
//    /**
//     * @Route("/")
//     * @Method("GET")
//     *
//     * Get all the shifts
//     */
//    public function findAllAction()
//    {
//
//        $em = $this->getDoctrine()->getManager();
//        $repository = $em->getRepository("AppBundle:Shift");
//
////        $now = new \DateTime();
//        $timestamp = strtotime('sunday this week +3 weeks');
//        $fourWeeksLater = date_timestamp_set(new \DateTime(), $timestamp);
//
//        $timestamp2 = strtotime('monday this week');
//        $mondayThisWeek = date_timestamp_set(new \DateTime(), $timestamp2);
//
//        $dates = [];
//
////        $interval = $mondayThisWeek->diff($fourWeeksLater);
////        $intervalDays = $interval->format("%d days");
////        settype($intervalDays, "int");
//
//        $diff = $mondayThisWeek->diff($fourWeeksLater);
//        $totalDays = intval($diff->format('%d'));
////        dump($totalDays);
//
//        $weekArray = array();
//        $planningArray = array();
//        $currentTimestamp = $mondayThisWeek->getTimestamp();
//        $dayCount = 1;
////        for($i = 0; $i < ($totalDays + 1); $i++) {
////
////
////            if($dayCount <= 7) {
////                $date = new \DateTime();
////                $date->setTimestamp($currentTimestamp);
////                array_push($weekArray, $date);
////
////            } else {
////                dump("new week");
////                array_push($planningArray, $weekArray);
////                $weekArray = array();
////                $dayCount = 0;
////            }
////
//////
//////            $test = new \DateTime();
//////            $test->setTimestamp($currentTimestamp);
//////            dump($test);
//////           dump(new \DateTime($currentTimestamp));
//////            array_push($testArray, $currentTimestamp);
////            $dayCount++;
////            $currentTimestamp += 86400;
////        }
//
//        $repositoryUsers = $em->getRepository("AppBundle:User");
//        $users = $repositoryUsers->findAll();
////        dump($users);
//
////        for ($i = 0; $i <= 3; $i++) {
////            for ($j = 0; $j <= 7; $j++) {
////
////                if ($j > 0) {
////                    $date = new \DateTime();
////                    $date->setTimestamp($currentTimestamp);
////                    array_push($weekArray, $date);
////                    $currentTimestamp += 86400;
////                } else {
////                    array_push($weekArray, []);
////                }
////
////            }
////
////            array_push($planningArray, $weekArray);
////            $weekArray = array();
////        }
//
//        $plannings = [];
//        $planning = [];
//        $heading = [];
//        $shifts = [];
//
////        plannings = [
////            planning = [
////                heading = []
////                shifts = []
////            ]
////        ]
//
//        for ($i = 0; $i <= 3; $i++) {
//            $temp = [];
//
//            for ($j = 0; $j <= 7; $j++) {
//                $date = new \DateTime();
//                $date->setTimestamp($currentTimestamp);
//                if ($j > 0) {
//                    array_push($heading, $date);
//                    $currentTimestamp += 86400;
//                } else {
//                    array_push($heading, $date);
//                }
//
//            }
//
//            array_push($planning, $heading);
//            $heading = [];
//
//            foreach ($users as $key => $user) {
//
//                for ($j = 0; $j <= 7; $j++) {
//                    array_push($shifts, $user->getId());
//                }
//
//                array_push($temp, $shifts);
//                $shifts = [];
//            }
//
//            array_push($planning, $temp);
//            array_push($plannings, $planning);
//
//            $planning = [];
//        }
//
//
//        dump($plannings);
//
//
////        dump($planningArray);
//
//
//        /**
//         * @var ShiftRepository $repository
//         */
////        $shifts = $repository->findAllAction($mondayThisWeek, $fourWeeksLater);
//        $shifts = $repository->findAll();
//
//        $data = $this->get('serializer')->serialize($shifts, 'json');
//        return new Response($data, 200, ['Content-Type' => 'application/json']);
//    }

    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the shifts
     */
    public function findAllAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Shift");

        $timestamp = strtotime('monday this week');
        $mondayThisWeek = date_timestamp_set(new \DateTime(), $timestamp);

        $timestamp2 = strtotime('sunday this week +3 weeks');
        $fourWeeksLater = date_timestamp_set(new \DateTime(), $timestamp2);

        $shifts = $repository->findPlanning($mondayThisWeek, $fourWeeksLater);

//        dump($shifts);

        $data = $this->get('serializer')->serialize($shifts, 'json');
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

}
