<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Task;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class TasksController
 * @package AppBundle\Controller\Api
 *
 * @Route("/api/tasks")
 */

class TasksController extends Controller
{
    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the tasks
     */
    public function findAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:Task");

        $tasks = $repository->findAll();

        $data = $this->get('serializer')->serialize($tasks, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a single task
     */
    public function findOneAction(Task $tasks){
        $data= $this->get('serializer')->serialize($tasks, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}