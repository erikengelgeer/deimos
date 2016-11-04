<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Task;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

/**
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

//        dump($tasks);
        $data = $this->get('serializer')->serialize($tasks, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @param Request $request
     * @Route("/")
     * @Method("POST")
     * @return Response
     */
    public function addAction(Request $request)
    {

        $data = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();

        $taskType = $em->getRepository('AppBundle:TaskType')->find($data->taskType->id);
        $shift = $em->getRepository('AppBundle:Shift')->find($data->shift->id);

        $task = new Task();
        $task->setStartTime(new \DateTime($data->startTime));
        $task->setEndTime(new \DateTime($data->endTime));
        $task->setDescription($data->taskType->description);
        $task->setShiftFk($shift);
        $task->setTaskTypeFk($taskType);

        (isset($data->description)) ? $task->setDescription($data->taskType->description . " - " . $data->description) : $task->setDescription($data->taskType->description);

        if(isset($data->url)){
            $task->setUrl($data->url);
        }

        $em->persist($task);
        $em->flush();

        $data = $this->get('serializer')->serialize($task, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("PUT")
     */
    public function updateAction(Task $task, Request $request) {
        $em = $this->getDoctrine()->getManager();
        $content = json_decode($request->getContent());

        $taskType = $em->getRepository('AppBundle:TaskType')->find($content->task_type_fk->id);

        $task->setStartTime(new \DateTime($content->start_time));
        $task->setEndTime(new \DateTime($content->end_time));
        $task->setTaskTypeFk($taskType);
        $task->setDescription($taskType->getDescription());

        if(isset($content->url)){
            $task->setUrl($content->url);
        }

        $em->flush();

        $data = $this->get('serializer')->serialize($task, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("DELETE")
     * @param Task $task
     * @return Response
     */
    public function deleteAction(Task $task)
    {
        $em = $this->getDoctrine()->getManager();

        $em->remove($task);
        $em->flush();

        $data = $this->get('serializer')->serialize(array("success" => true), 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a single task
     */
    public function findOneAction(Task $tasks)
    {
        $data = $this->get('serializer')->serialize($tasks, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}