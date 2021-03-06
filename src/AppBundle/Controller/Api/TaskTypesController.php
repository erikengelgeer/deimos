<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Task;
use AppBundle\Entity\TaskType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/task-types")
 */
class TaskTypesController extends Controller
{
    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the taskTypes
     */
    public function findAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:TaskType");

        $taskType = $repository->findBy(array("enabled" => true));

        $data = $this->get('serializer')->serialize($taskType, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/")
     * @Method("POST")
     *
     * Add a taskType
     */
    public function addAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $content = json_decode($request->getContent());

        if (count($em->getRepository('AppBundle:TaskType')->findOneBy(array("short" => $content->short))) > 0) {
            $response = $this->get('serializer')->serialize(array("result" => false), 'json');
            return new Response($response, 200, ['Content-type' => 'application/json']);
        }

        $taskType = new TaskType();
        $taskType->setDescription($content->description);
        $taskType->setShort($content->short);

        $em->persist($taskType);
        $em->flush();

        $data = $this->get('serializer')->serialize(array("result" => true), 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a single taskType
     */
    public function findOneAction(TaskType $taskType)
    {
        $data = $this->get('serializer')->serialize($taskType, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/update")
     * @Method("PUT")
     *
     * Update a single taskType
     */
    public function updateAction(Request $request)
    {
        $content = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();
        $task = $em->getRepository("AppBundle:TaskType")->find($content->id);

        if($content->short != $task->getShort()) {
            $result = $em->getRepository('AppBundle:TaskType')->findOneBy(array('short' => $content->short));

            if(count($result) > 0) {
                $data = $this->get('serializer')->serialize(["result" => false], 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }
        }

        $task->setShort($content->short);
        $task->setDescription($content->description);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("POST")
     *
     * Disable a single taskType
     */
    public function disableAction(TaskType $taskType)
    {
        $em = $this->getDoctrine()->getManager();

        $taskType->setEnabled(false);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}