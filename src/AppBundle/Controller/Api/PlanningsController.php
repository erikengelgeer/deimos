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
//    /**
//     * @Route("/")
//     * @Method("GET")
//     */
//    public function findAction()
//    {
//        $em = $this->getDoctrine()->getManager();
//        $repository = $em->getRepository("AppBundle:User");
//
//        $users = $repository->findAll();
//
//        $data = $this->get('serializer')->serialize($users, 'json');
//        return new Response($data, 200, ['Content-type' => 'application/json']);
//    }
//
//    /**
//     * @Route("/{id}")
//     * @Method("GET")
//     */
//    public function findOneAction(User $user)
//    {
//        $data = $this->get('serializer')->serialize($user, 'json');
//        return new Response($data, 200, ['Content-type' => 'application/json']);
//    }

    /**
     * @Route("/")
     * @Method("GET")
     */
    public function findAction()
    {
        $em = $this->getDoctrine()->getManager();
        $shiftRepo = $em->getRepository('AppBundle:Shift');

        $shifts = $shiftRepo->findPlanning();

        $data = $this->get('serializer')->serialize($shifts, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}