<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\TaskType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class TaskTypeController
 * @package AppBundle\Controller\Api
 *
 * @Route("/api/task-type")
 */
class TaskTypeController extends Controller
{
    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the taskType
     */
    public function findAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:TaskType");

        $taskType = $repository->findAll();

        $data= $this->get('serializer')->serialize($taskType, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     */
    public function findOneAction(TaskType $taskType){
        $data= $this->get('serializer')->serialize($taskType, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}