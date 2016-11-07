<?php


namespace AppBundle\Controller\Api;

use AppBundle\Entity\Team;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


/**
 * @Route("/api/teams")
 */
class TeamsController extends Controller
{

    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the teams
     */
    public function findAllAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Team");

        $teams = $repository->findBy(array("enabled" => true));

        $data = $this->get('serializer')->serialize($teams, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/")
     * @Method("POST")
     * @param Request $request
     * @return Response
     *
     * Adds a new team.
     */
    public function addAction(Request $request)
    {
        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();

        $team = new Team();
        $team->setName($content->name);
        $team->setShort($content->short);
        $team->setLocation($content->location);
        $team->setTimezone($content->timezone);

        if (count($em->getRepository('AppBundle:Team')->findOneBy(array("name" => $team->getName()))) > 0) {
            $response = $this->get('serializer')->serialize(array("result" => false), 'json');
            return new Response($response, 200, ['Content-type' => 'application/json']);
        }

        $em->persist($team);
        $em->flush();

        $data = $this->get('serializer')->serialize(array("result" => true), 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a single team
     */
    public function findOneById(Team $team)
    {
        $data = $this->get('serializer')->serialize($team, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("PUT")
     */
    public function updateAction(Team $team, Request $request)
    {
        $content = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();

        if ($content->name != $team->getName()) {
            $result = $em->getRepository('AppBundle:Team')->findOneBy(array('name' => $content->name));

            if (count($result) > 0) {
                $data = $this->get('serializer')->serialize(["result" => false], 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }
        }

        $team->setName($content->name);
        $team->setLocation($content->location);
        $team->setShort($content->short);
        $team->setTimezone($content->timezone);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("POST")
     */
    public function disableAction(Team $team)
    {
        $em = $this->getDoctrine()->getManager();

        $team->setEnabled(false);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}