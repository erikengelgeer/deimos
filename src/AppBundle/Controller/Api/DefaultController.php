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
        $data = $this->get('serializer')->serialize("", 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
        
        $manager = $this->get('fos_user.user_manager');

        $users = $manager->findUsers();

        $today = new \DateTime();
        $today->setTimezone(new \DateTimeZone('UTC'));

        /** @var \AppBundle\Entity\User $user */
        foreach ($users as $user) {
           /* if ($user->getUsername() == 'ao_ezcev') {
                continue;
            }

            $user->setPassword(null);
            $user->setPlainPassword('Agfa-' . $user->getId());
            $user->setLastLogin(null);
            $user->setCredentialsExpireAt($today);
            $user->setCredentialsExpired(true);

            $user->setExpired(false);
            $user->setLocked(false);

            $manager->updateUser($user);*/

             if ($user->getUsername() == 'ao_nick') {
                 $tokenGenerator = $this->get('fos_user.util.token_generator');
                 $token = $tokenGenerator->generateToken();

                 $user->setLastLogin(null);
                 $user->setConfirmationToken($token);
                 $user->setCredentialsExpired(true);
                 $user->setPasswordRequestedAt(null);
                 $manager->updateUser($user);

                 $message = \Swift_Message::newInstance()
                     ->setSubject('Deimos - Welcome to Deimos')
                     ->setFrom('noreply@agfa.com')
                     ->setTo($user->getEmail())
                     ->setBody(
                         $this->renderView('emails/new-user.html.twig', array("user" => $user, "token" => $token)), 'text/html'
                     );

                 $this->get('mailer')->send($message);
            }
        }

        $data = $this->get('serializer')->serialize($users, 'json');
        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }
}