<?php
/**
 * Created by PhpStorm.
 * User: EAETV
 * Date: 13/09/2016
 * Time: 9:33
 */

namespace AppBundle\Controller\Api;

use AppBundle\Entity\ShiftType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("api/shift-types")
 */
class ShiftTypesController extends Controller
{
    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the shiftTypes
     */
    public function findAllAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:ShiftType");

        $shiftTypes = $repository->findBy(array("enabled" => true));

        $data = $this->get('serializer')->serialize($shiftTypes, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a single shiftType
     *
     */
    public function findOneByAction(ShiftType $shiftType)
    {
        $data= $this->get('serializer')->serialize($shiftType, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/")
     * @Method("POST")
     * @param Request $request
     * @return Response
     *
     * Adds a new shiftType
     */
    public function addAction(Request $request) {
        $data = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();

        $team = $em->getRepository('AppBundle:Team')->findOneBy(array('id' => $data->team->id));
        dump($team);
        $shift = new ShiftType();
        $shift->setDescription($data->description);
        $shift->setShort($data->short);
        $shift->setDefaultStartTime(new \DateTime($data->default_start_time));
        $shift->setDefaultEndTime(new \DateTime($data->default_end_time));
        $shift->setWholeday($data->wholeday);
        $shift->setShiftDuration('');
        $shift->setWorkhoursDurationH('');
        $shift->setBreadDuration('');
        $shift->setRecordCreatedAt(new \DateTime());
        $shift->setRecordCreatedBy('');
        $shift->setStatus('');
        $shift->setTeamFk($team);

        if(count($em->getRepository('AppBundle:ShiftType')->findOneBy(array("short" => $shift->getShort(), "teamFk" => $team->getId()))) > 0) {
            $response = $this->get('serializer')->serialize(array("result" => false), 'json');
            return new Response($response, 200, ['Content-type' => 'application/json']);
        }

        $em->persist($shift);
        $em->flush();

        $response = $this->get('serializer')->serialize(array("result" => true), 'json');
        return new Response($response, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("PUT")
     */
    public function updateAction(ShiftType $shiftType, Request $request) {
        $content = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();

        $team = $em->getRepository('AppBundle:Team')->findOneBy(array('id' => $content->team_fk->id));


        $shiftType->setDescription($content->description);
        $shiftType->setShort($content->short);
        $shiftType->setDefaultStartTime(new \DateTime($content->default_start_time));
        $shiftType->setDefaultEndTime(new \DateTime($content->default_end_time));
        $shiftType->setBreadDuration($content->bread_duration);
        $shiftType->setTeamFk($team);
        $shiftType->setWholeday($content->wholeday);
dump($shiftType->getShort());
        if(count($em->getRepository('AppBundle:ShiftType')->findOneBy(array("short" => $shiftType->getShort(), "teamFk" => $team->getId()))) > 0) {
            $response = $this->get('serializer')->serialize(array("result" => false), 'json');
            return new Response($response, 200, ['Content-type' => 'application/json']);
        }

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => "success"], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("POST")
     */
    public function disableAction(ShiftType $shiftType)
    {
        $em = $this->getDoctrine()->getManager();

        $shiftType->setEnabled(false);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}
