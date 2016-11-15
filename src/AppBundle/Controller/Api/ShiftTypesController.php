<?php
/**
 * Created by PhpStorm.
 * User: EAETV
 * Date: 13/09/2016
 * Time: 9:33
 */

namespace AppBundle\Controller\Api;

use AppBundle\AppBundle;
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
    public function findAllByTeamAction($team, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:ShiftType");

        $shiftTypes = $repository->findBy(array("teamFk" => $team, "enabled" => true));
        $timezone = $request->query->get('timezone');

        foreach ($shiftTypes as $item) {
            $startTime = new \DateTime($item->getDefaultStartTime()->format('H:i:s'), new \DateTimeZone('UTC'));
            $item->setDefaultStartTime($startTime->setTimezone(new \DateTimeZone($timezone)));

            $endTime = new \DateTime($item->getDefaultEndTime()->format('H:i:s'), new \DateTimeZone('UTC'));
            $item->setDefaultEndTime($endTime->setTimezone(new \DateTimeZone($timezone)));

            $item->setTimezoneOffset(strval($item->getDefaultStartTime()->format('Z') / 3600));

            if($item->getDefaultStartTime()->format('Z') / 3600 > 0) {
                $item->setTimezoneOffset("+".strval($item->getDefaultStartTime()->format('Z') / 3600));
            } else {
                $item->setTimezoneOffset(strval($item->getDefaultStartTime()->format('Z') / 3600));
            }
        }

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
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:ShiftType");

        $shiftTypes = $repository->findOneBy(array("id" => $shiftType->getId()));
        $startTime = new \DateTime($shiftTypes->getDefaultStartTime()->format('H:i:s'), new \DateTimeZone('UTC'));
        $shiftTypes->setDefaultStartTime($startTime->setTimezone(new \DateTimeZone($shiftType->getTeamFk()->getTimezone())));

        $endTime = new \DateTime($shiftTypes->getDefaultEndTime()->format('H:i:s'), new \DateTimeZone('UTC'));
        $shiftTypes->setDefaultEndTime($endTime->setTimezone(new \DateTimeZone($shiftType->getTeamFk()->getTimezone())));

        $data = $this->get('serializer')->serialize($shiftTypes, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/")
     * @Method("POST")
     * @param Request $request
     * @return Response
     *
     * Add a new shiftType
     */
    public function addAction(Request $request)
    {
        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();

        $team = $em->getRepository('AppBundle:Team')->findOneBy(array('id' => $content->team->id));

        $timezone = $content->team->timezone;

        if ($content->wholeDay) {
            $startTime = new \DateTime("1970-01-01 00:00:00", new \DateTimeZone($timezone));
            $endTime = new \DateTime("1970-01-01 23:59:59", new \DateTimeZone($timezone));
        } else {
            $startTime = new \DateTime($content->default_start_time, new \DateTimeZone($timezone));
            $endTime = new \DateTime($content->default_end_time, new \DateTimeZone($timezone));
        }

        $startTimeUTC = $startTime->setTimezone(new \DateTimeZone('UTC'));
        $endTimeUTC = $endTime->setTimezone(new \DateTimeZone('UTC'));

        $shiftType = new ShiftType();
        $shiftType->setDescription($content->description);
        $shiftType->setShort($content->short);
        $shiftType->setColor($content->color);
        $shiftType->setTeamFk($team);
        $shiftType->setDefaultStartTime($startTimeUTC);
        $shiftType->setDefaultEndTime($endTimeUTC);

        if ($content->wholeDay) {
            $shiftType->setBreakDuration(00);
            $shiftType->setShiftDuration(00);
            $shiftType->setWorkhoursDurationH(00);

        } else {
            $diff = $shiftType->getDefaultStartTime()->diff($shiftType->getDefaultEndTime());

            $shiftType->setBreakDuration($content->break_duration / 60);
            $shiftType->setShiftDuration($diff->h + ($diff->i / 60));
            $shiftType->setWorkhoursDurationH($shiftType->getShiftDuration() - $shiftType->getBreakDuration());
        }

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
     *
     * Update a single shiftType
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

        if ($content->wholeDay) {
            $shiftType->setDefaultStartTime(new \DateTime("1970-01-01 00:00:00"));
            $shiftType->setDefaultEndTime(new \DateTime("1970-01-01 23:59:59"));

            $shiftType->setBreakDuration(00);
            $shiftType->setShiftDuration(00);
            $shiftType->setWorkhoursDurationH(00);

        } else {

            if (isset($content->default_start_time) && isset($content->default_end_time)) {
                $shiftType->setDefaultStartTime(new \DateTime($content->default_start_time));
                $shiftType->setDefaultEndTime(new \DateTime($content->default_end_time));
            }
            $diff = $shiftType->getDefaultStartTime()->diff($shiftType->getDefaultEndTime());
            $shiftType->setBreakDuration($content->break_duration);
            $shiftType->setShiftDuration($diff->h + ($diff->i / 60));
            $shiftType->setWorkhoursDurationH($shiftType->getShiftDuration() - $shiftType->getBreakDuration());

            if ($content->short != $shiftType->getShort()) {
                if (count($em->getRepository('AppBundle:ShiftType')->findOneBy(array("short" => $shiftType->getShort(), "teamFk" => $team->getId()))) > 0) {
                    $data = $this->get('serializer')->serialize(array("result" => false), 'json');
                    return new Response($data, 200, ['Content-type' => 'application/json']);
                }
            }
        }

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("POST")
     *
     * Disable a shiftType
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
