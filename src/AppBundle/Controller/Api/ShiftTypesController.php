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
     * @Route("/{team}")
     * @Method("GET")
     *
     * Get all the shiftTypes by team
     */
    public function findAllByTeamAction($team)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:ShiftType");

        $shiftTypes = $repository->findBy(array("teamFk" => $team, "enabled" => true));

        $data = $this->get('serializer')->serialize($shiftTypes, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/single/{id}")
     * @Method("GET")
     *
     * Get a single shiftType
     *
     */
    public function findOneByAction(ShiftType $shiftType)
    {
        $data = $this->get('serializer')->serialize($shiftType, 'json');
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
    public function addAction(Request $request)
    {
        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();

        $team = $em->getRepository('AppBundle:Team')->findOneBy(array('id' => $content->team->id));

        $shiftType = new ShiftType();
        $shiftType->setDescription($content->description);
        $shiftType->setShort($content->short);
        $shiftType->setColor($content->color);
        $shiftType->setTeamFk($team);

        if (isset($content->default_start_time) && isset($content->default_end_time)) {
            $shiftType->setDefaultStartTime(new \DateTime($content->default_start_time));
            $shiftType->setDefaultEndTime(new \DateTime($content->default_end_time));
        }

        $diff = $shiftType->getDefaultStartTime()->diff($shiftType->getDefaultEndTime());

        $shiftType->setBreakDuration($content->break_duration / 60);
        $shiftType->setShiftDuration($diff->h + ($diff->i / 60));
        $shiftType->setWorkhoursDurationH($shiftType->getShiftDuration() - $shiftType->getBreakDuration());
        

        if (count($em->getRepository('AppBundle:ShiftType')->findOneBy(array("short" => $shiftType->getShort(), "teamFk" => $team->getId()))) > 0) {
            $data = $this->get('serializer')->serialize(array("result" => false), 'json');
            return new Response($data, 200, ['Content-type' => 'application/json']);
        }

        $em->persist($shiftType);
        $em->flush();

        $data = $this->get('serializer')->serialize(array("result" => true), 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("PUT")
     */
    public function updateAction(ShiftType $shiftType, Request $request)
    {
        $content = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();

        $team = $em->getRepository('AppBundle:Team')->findOneBy(array('id' => $content->team_fk->id));


        $shiftType->setDescription($content->description);
        $shiftType->setShort($content->short);
        $shiftType->setTeamFk($team);
        $shiftType->setColor($content->color);

        if(isset($content->default_start_time) && isset($content->default_end_time)) {
            $shiftType->setDefaultStartTime(new \DateTime($content->default_start_time));
            $shiftType->setDefaultEndTime(new \DateTime($content->default_end_time));
        }
        $diff = $shiftType->getDefaultStartTime()->diff($shiftType->getDefaultEndTime());
        $shiftType->setBreakDuration($content->break_duration);
        $shiftType->setShiftDuration($diff->h + ($diff->i / 60));
        $shiftType->setWorkhoursDurationH($shiftType->getShiftDuration() - $shiftType->getBreakDuration());

        if($content->short != $shiftType->getShort()) {
            if (count($em->getRepository('AppBundle:ShiftType')->findOneBy(array("short" => $shiftType->getShort(), "teamFk" => $team->getId()))) > 0) {
                $data = $this->get('serializer')->serialize(array("result" => false), 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }
        }

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
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
