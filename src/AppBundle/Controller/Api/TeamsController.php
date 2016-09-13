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
}