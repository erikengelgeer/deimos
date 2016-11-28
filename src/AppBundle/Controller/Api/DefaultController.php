<?php
/**
 * Created by PhpStorm.
 * User: ezcev
 * Date: 4-10-2016
 * Time: 11:15
 */

namespace AppBundle\Controller\Api;


use AppBundle\AppBundle;
use AppBundle\Entity\User;
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
     *
     * Get all timezones
     */
    public function getTimezones()
    {
        $timezones = \DateTimeZone::listIdentifiers();

        $data = $this->get('serializer')->serialize($timezones, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/start-test")
     * @Method("GET")
     */
    public function startTestAction()
    {
        //$data = $this->get('serializer')->serialize("", 'json');
        //return new Response($data, 200, ['Content-Type' => 'application/json']);

        $manager = $this->get('fos_user.user_manager');

        $users = $manager->findUsers();

        $today = new \DateTime();
        $today->setTimezone(new \DateTimeZone('UTC'));

        /** @var \AppBundle\Entity\User $user */
        foreach ($users as $user) {
            if ($user->getUsername() == 'ao_ezcev') {
                continue;
            }

            if ($user->getConfirmationToken() == null) {
                $tokenGenerator = $this->get('fos_user.util.token_generator');
                $token = $tokenGenerator->generateToken();

                $user->setLastLogin(null);
                $user->setConfirmationToken($token);
                $user->setCredentialsExpired(true);
                $user->setPasswordRequestedAt(null);
                $manager->updateUser($user);

                $message = \Swift_Message::newInstance()
                    ->setSubject('Deimos - Welcome to GRIP scheduling tool')
                    ->setFrom('noreply@agfa.com')
                    ->setTo($user->getEmail())
                    ->setBody(
                        $this->renderView('emails/first-time.html.twig', array("user" => $user, "token" => $token)), 'text/html'
                    );

                $this->get('mailer')->send($message);
            }

        }

        $data = $this->get('serializer')->serialize($users, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }
}