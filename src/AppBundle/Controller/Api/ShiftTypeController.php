<?php
/**
 * Created by PhpStorm.
 * User: EAETV
 * Date: 13/09/2016
 * Time: 9:33
 */

namespace AppBundle\Controller\Api;

use AppBundle\Entity\ShiftType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * Class ShiftTypeRepository
 * @package AppBundle\Repository
 *
 * @Route("api/shift-types")
 */
class ShiftTypesController extends Controller
{
    /**
     * @Route("/")
     *
     */
    public function findAllAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:ShiftType");

        $shiftTypes = $repository->findAll();

        $data = $this->get('serializer')->serialize($shiftTypes, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     */
    public function findOneByAction(ShiftType $shiftType)
    {
        $data= $this->get('serializer')->serialize($shiftType, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

}

