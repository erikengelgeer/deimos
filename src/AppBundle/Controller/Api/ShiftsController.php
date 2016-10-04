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
     * @Route("/")
     * @Method("GET")
     *
     * Get all the shifts
     */
    public function findAllAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Shift");

        $now = new \DateTime();
        $timestamp = strtotime('+4 weeks');
        $fourWeeksLater = date_timestamp_set(new \DateTime(), $timestamp);

        /**
         * @var ShiftRepository $repository
         */
//        $shifts = $repository->findAllAction($now, $fourWeeksLater);
        $shifts = $repository->findAll();

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
        $data= $this->get('serializer')->serialize($shift, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/user/{id}")
     * @Method("GET")
     */
    function findAllByUser(User $user) {
        dump($user);

        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('AppBundle:Shift');

        $shifts = $repository->findBy(array("userFk" => $user));

        dump($shifts[0]->getTasks()[0]->getDescription());
    }

}
