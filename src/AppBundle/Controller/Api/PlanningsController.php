<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/planning")
 */
class PlanningsController extends Controller
{

    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get the planning
     */
    public function findAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Shift");
        $timestamp2 = strtotime('monday this week');
        $mondayThisWeek = date_timestamp_set(new \DateTime(), $timestamp2);
        $currentTimestamp = $mondayThisWeek->getTimestamp();

        $repositoryUsers = $em->getRepository("AppBundle:User");
        $users = $repositoryUsers->findAll();

        $plannings = [];
        $planning = [];
        $heading = [];
        $shifts = [];

        for ($i = 0; $i <= 3; $i++) {
            $temp = [];

            for ($j = 0; $j <= 7; $j++) {
                $date = new \DateTime();
                $date->setTimestamp($currentTimestamp);
                if ($j > 0) {
                    array_push($heading, $date);
                    $currentTimestamp += 86400;
                } else {
                    array_push($heading, $date);
                }
            }
            array_push($planning, $heading);
            $heading = [];

            foreach ($users as $key => $user) {
                for ($j = 0; $j <= 7; $j++) {
                    array_push($shifts, $user->getId());
                }
                array_push($temp, $shifts);
                $shifts = [];
            }
            array_push($planning, $temp);
            array_push($plannings, $planning);
            $planning = [];
        }

        /**
         * @var ShiftRepository $repository
         */
        $shifts = $repository->findAll();
        $data = $this->get('serializer')->serialize($shifts, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }
}