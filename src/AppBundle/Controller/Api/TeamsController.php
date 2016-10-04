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
    public function findAllAction() {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Team");

        $teams = $repository->findAll();

        $data = $this->get('serializer')->serialize($teams, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a single team
     */
    public function findOneById(Team $team) {
        $data = $this->get('serializer')->serialize($team, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/")
     * @Method("PUT")
     */
    public function updateAction(Request $request) {
        $content = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();
        $team = $em->getRepository("AppBundle:Team")->find($content->id);

        if($content->name != $team->getName()) {
            $result = $em->getRepository('AppBundle:Team')->findOneBy(array('name' => $content->name));

            if(count($result) > 0) {
                $data = $this->get('serializer')->serialize(["result" => "name must be unique"], 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }
        }

        $team->setName($content->name);
        $team->setLocation($content->location);
        $team->setShort($content->short);
        $team->setTimezone($content->timezone);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => "success"], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}