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

                if($shift != null) {
                    $shift->setShiftTypeFk($shiftType);
                    $shift->setDescription($shiftType->getDescription());
                    $shift->setStartTime($shiftType->getDefaultStartTime());
                    $shift->setEndTime($shiftType->getDefaultEndTime());

                } else {
                    $shift = new Shift();
                    $shift->setUserFk($user);
                    $shift->setShiftTypeFk($shiftType);
                    $shift->setDescription($shiftType->getDescription());
                    $shift->setStartTime($shiftType->getDefaultStartTime());
                    $shift->setEndTime($shiftType->getDefaultEndTime());
                    $shift->setDate(new \DateTime($date));

                    $em->persist($shift);
                }
            }
        }

        $em->flush();

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
        dump($user);

        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('AppBundle:Shift');

        $shifts = $repository->findBy(array("userFk" => $user));

        dump($shifts[0]->getTasks()[0]->getDescription());
    }


}
