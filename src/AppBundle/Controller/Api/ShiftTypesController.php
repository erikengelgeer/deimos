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

        $shiftTypes = $repository->findAll();

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
     * @Route("/update")
     * @Method("PUT")
     */
    public function updateAction(Request $request) {
        $content = json_decode($request->getContent());
        dump($content);
        $em = $this->getDoctrine()->getManager();
        $shift = $em->getRepository("AppBundle:ShiftType")->find($content->id);
        $team = $em->getRepository('AppBundle:Team')->findOneBy(array('id' => $content->team_fk->id));

        dump($team);

        $shift->setDescription($content->description);
        $shift->setShort($content->short);
        $shift->setDefaultStartTime(new \DateTime($content->default_start_time));
        $shift->setDefaultEndTime(new \DateTime($content->default_end_time));
        $shift->setBreadDuration($content->bread_duration);
        $shift->setTeamFk($team);
        $shift->setWholeday($content->wholeday);

        dump($shift);
        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => "success"], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

}

