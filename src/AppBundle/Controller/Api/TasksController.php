<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Task;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints\DateTime;

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

        $data = $this->get('serializer')->serialize($tasks, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @param Request $request
     * @Route("/")
     * @Method("POST")
     * @return Response
     *
     * Add a new task
     */
    public function addAction(Request $request)
    {

        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();

        $timezone = $request->query->get('timezone');

        $taskType = $em->getRepository('AppBundle:TaskType')->find($content->taskType->id);
        $shift = $em->getRepository('AppBundle:Shift')->find($content->shift->id);

        $task = new Task();
        $task->setDescription($content->taskType->description);
        $task->setShiftFk($shift);
        $task->setTaskTypeFk($taskType);

        (isset($content->description)) ? $task->setDescription($content->taskType->description . " - " . $content->description) : $task->setDescription($content->taskType->description);

        if (isset($content->url)) {
            $task->setUrl('https://agfa.service-now.com/nav_to.do?uri=textsearch.do?sysparm_search=' . $content->url);
        }

        if ($content->wholeDay) {
            $startTime = new \DateTime("1970-01-01 00:00:00", new \DateTimeZone($timezone));
            $endTime = new \DateTime("1970-01-01 23:59:59", new \DateTimeZone($timezone));
        } else {
            $startTime = new \DateTime($content->startTime, new \DateTimeZone($timezone));
            $endTime = new \DateTime($content->endTime, new \DateTimeZone($timezone));
        }

        $startTime->setTimezone(new \DateTimeZone('UTC'));
        $endTime->setTimezone(new \DateTimeZone('UTC'));

        $task->setStartTime($startTime);
        $task->setEndTime($endTime);

        $em->persist($task);
        $em->flush();

        $data = $this->get('serializer')->serialize($task, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("PUT")
     *
     * Update a single task
     */
    public function updateAction(Task $task, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $content = json_decode($request->getContent());

        $timezone = $request->query->get('timezone');

        $taskType = $em->getRepository('AppBundle:TaskType')->find($content->task_type_fk->id);

        $task->setTaskTypeFk($taskType);

        $task->setDescription($content->description);

        if ($content->task_type_fk->description == "Other" || $content->task_type_fk->description == "SuperService") {
            if (isset($content->url)) {
                $task->setUrl('https://agfa.service-now.com/nav_to.do?uri=textsearch.do?sysparm_search=' . $content->url);
            }
        } else {
            $task->setUrl(null);
        }

        if ($content->wholeDay) {
            $startTime = new \DateTime("1970-01-01 00:00:00", new \DateTimeZone($timezone));
            $endTime = new \DateTime("1970-01-01 23:59:59", new \DateTimeZone($timezone));
        } else {
            $startTime = new \DateTime($content->start_time);
            $startTime = new \DateTime($startTime->format('H:i:s'), new \DateTimeZone($timezone));

            $endTime = new \DateTime($content->end_time);
            $endTime = new \DateTime($endTime->format('H:i:s'), new \DateTimeZone($timezone));
        }

        $startTime->setTimezone(new \DateTimeZone('UTC'));
        $endTime->setTimezone(new \DateTimeZone('UTC'));

        $task->setStartTime($startTime);
        $task->setEndTime($endTime);

        $em->flush();

        $data = $this->get('serializer')->serialize($task, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/edit/{id}")
     * @Method("PUT")
     * @param Task $task
     * @return response
     * Update a task on the fly
     */
    public function updateOnTheFlyAction(Task $task, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $content = json_decode($request->getContent());

        $timezone = $request->query->get('timezone');

        if ($content->wholeDay) {
            $startTime = new \DateTime("1970-01-01 00:00:00", new \DateTimeZone($timezone));
            $endTime = new \DateTime("1970-01-01 23:59:59", new \DateTimeZone($timezone));
        } else {
            $startTime = new \DateTime($content->startTime);
            $startTime = new \DateTime($startTime->format('H:i:s'), new \DateTimeZone($timezone));

            $endTime = new \DateTime($content->endTime);
            $endTime = new \DateTime($endTime->format('H:i:s'), new \DateTimeZone($timezone));
        }

        $startTime->setTimezone(new \DateTimeZone('UTC'));
        $endTime->setTimezone(new \DateTimeZone('UTC'));

        $task->setStartTime($startTime);
        $task->setEndTime($endTime);

        $em->flush();

        $data = $this->get('serializer')->serialize($task, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("DELETE")
     * @param Task $task
     * @return Response
     *
     * Delete a single task
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