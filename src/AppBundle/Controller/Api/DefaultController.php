<?php
/**
 * Created by PhpStorm.
 * User: ezcev
 * Date: 4-10-2016
 * Time: 11:15
 */

namespace AppBundle\Controller\Api;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class DefaultController
 * @package AppBundle\Controller\Api
 *
 * @Route("/api")
 */
class DefaultController extends Controller
{

    /**
     * @Route("/timezones")
     * @Method("GET")
     */
    public function getTimezones() {
        $timezones = \DateTimeZone::listIdentifiers();

        $data = $this->get('serializer')->serialize($timezones, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/colors")
     * @Method("GET")
     */
    public function getColors() {
        $colors = ['#ffeb3b', '#ffc107', '#ff9800', '#EE4A25', '#00b050', '#999999'];

        $data = $this->get('serializer')->serialize($colors, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }
}