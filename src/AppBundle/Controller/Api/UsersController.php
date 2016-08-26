<?php

namespace AppBundle\Controller\Api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class UsersController
 * @package AppBundle\Controller\Api
 *
 * @Route("/api/users")
 */
class UsersController extends Controller
{

    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the users
     */
    public function findAction()
    {
        $data= $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a specific user
     */
    public function findUserAction()
    {
        $data= $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/")
     * @Method("POST")
     *
     * Adds a new user
     */
    public function addUserAction()
    {
        $data= $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/update/info")
     * @Method("POST")
     *
     * Updates a users info
     */
    public function updateInfoAction()
    {
        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/update/password")
     * @Method("POST")
     *
     * Updates a users password
     */
    public function updatePasswordAction()
    {
        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/delete/{id}")
     * @Method("POST")
     *
     * Deletes a certain user
     */
    public function deleteUserAction()
    {
        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/request-password/{email}")
     * @Method("POST")
     *
     * Request password through email
     */
    public function requestPasswordAction()
    {
        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}