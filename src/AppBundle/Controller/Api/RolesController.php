<?php

namespace AppBundle\Controller\Api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class RoleController
 * @package AppBundle\Repository
 *
 * @Route("api/roles")
 */
class RoleController extends Controller
{

    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the roles
     */
    public function findAllAction() {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Role");

        $roles = $repository->findAll();

        $data = $this->get('serializer')->serialize($roles, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }
}