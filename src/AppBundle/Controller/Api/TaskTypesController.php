<?php

namespace AppBundle\Controller\Api;

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

        $taskType = $repository->findAll();

        $data= $this->get('serializer')->serialize($taskType, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a single taskType
     */
    public function findOneAction(TaskType $taskType){
        $data= $this->get('serializer')->serialize($taskType, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/update")
     * @Method("PUT")
     */
    public function updateAction(Request $request) {
        $content = json_decode($request->getContent());

        $em = $this->getDoctrine()->getManager();
        $task = $em->getRepository("AppBundle:TaskType")->find($content->id);

//        if($content->short != $task->getShort()) {
//            $result = $em->getRepository('AppBundle:TaskType')->findOneBy(array('short' => $content->short));
//
//            if(count($result) > 0) {
//                $data = $this->get('serializer')->serialize(["result" => "short must be unique"], 'json');
//                return new Response($data, 200, ['Content-type' => 'application/json']);
//            }
//        }


        $task->setShort($content->short);
        $task->setDescription($content->description);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => "success"], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}