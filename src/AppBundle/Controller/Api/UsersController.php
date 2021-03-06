<?php

namespace AppBundle\Controller\Api;

use AppBundle\Entity\Team;
use AppBundle\Entity\User;
//use AppBundle\Entity\Role;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\UserBundle\Doctrine\UserManager;
use FOS\UserBundle\Model\UserManagerInterface;

/**
 * @Route("/api/users")
 */
class UsersController extends Controller
{

    /**
     * @Route("/")
     * @Method("GET")
     *
     * Get all the users
     */
    public function findAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:User");

        $users = $repository->findBy(array("enabled" => true, "plannable" => true));

        $data = $this->get('serializer')->serialize($users, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/user")
     * @Method("GET")
     *
     * Get the logged in user.
     */
    public function findLoggedInUser()
    {
        $data = $this->get('serializer')->serialize($this->getUser(), 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/{id}")
     * @Method("GET")
     *
     * Get a specific user
     */
    public function findUserAction(User $user)
    {
        $data = $this->get('serializer')->serialize($user, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/update/password")
     * @Method("POST")
     *
     * Update a users password
     */
    public function updatePasswordAction(Request $request)
    {
        $content = $request->getContent();
        $user = $this->getUser();

        $user->setPlainPassword($content);
        $this->get('fos_user.user_manager')->updateUser($user);

        $data = $this->get('serializer')->serialize(array("result" => true), 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/request-password")
     * @Method("POST")
     *
     * Request password through email
     */
    public function requestPasswordAction(Request $request)
    {
        $content = $request->getContent();

        $manager = $this->get('fos_user.user_manager');
        /** @var \AppBundle\Entity\User $user */
        $user = $manager->findUserByEmail($content);

        $tokenGenerator = $this->get('fos_user.util.token_generator');
        $token = $tokenGenerator->generateToken();

        $user->setLastLogin(null);
        $user->setConfirmationToken($token);
        $user->setCredentialsExpired(true);

        $manager->updateUser($user);

        $message = \Swift_Message::newInstance()
            ->setSubject('Deimos - Password request')
            ->setFrom('noreply@agfa.com')
            ->setTo($user->getEmail())
            ->setBody(
                $this->renderView('emails/password-request.html.twig', array("user" => $user, "token" => $token)), 'text/html'
            );

        $this->get('mailer')->send($message);


        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/reset-password")
     * @Method("POST")
     *
     * Resets password
     */
    public function resetPasswordAction(Request $request)
    {
        $content = json_decode($request->getContent());

        $manager = $this->get('fos_user.user_manager');
        $user = $manager->findUserByConfirmationToken($content->confirmation_token);

        $user->setConfirmationToken(null);
        $user->setCredentialsExpired(false);
        $user->setCredentialsExpireAt(null);
        $user->setPasswordRequestedAt(null);
        $user->setPlainPassword($content->newPassword);

        $manager->updateUser($user);

        $data = $this->get('serializer')->serialize(array("result" => true), 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/user/check_role")
     * @Method("POST")
     *
     * Checks if a user has a role.
     */
    public function checkRoleAction(Request $request)
    {
        $content = $request->getContent();

        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:User");

        $user = $repository->findOneBy(array("username" => $content));

        if ($user != null) {


            $role = $user->getRoleFk()->getRole();

            if (strtolower($role) == 'agent') {
                $data = $this->get('serializer')->serialize(['result' => false, 'info' => "no password needed."], 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }

            $data = $this->get('serializer')->serialize(['result' => true, 'info' => "password is needed."], 'json');
            return new Response($data, 200, ['Content-type' => 'application/json']);

        }

        $data = $this->get('serializer')->serialize(['result' => null, 'info' => "User does not exist."], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);

    }

    /**
     * @Route("/update/password")
     * @Method("POST")
     *
     * Changes the password of the logged in user.
     */
    public function changePasswordAction(Request $request)
    {
        $content = json_decode($request->getContent());
        $user = $this->getUser();

        $user->setPlainPassword($content->password);
        $this->get('fos_user.user_manager')->updateUser($user);
    }

    /**
     * @Route("/token/{token}")
     * @Method("GET")
     *
     * Get a single user a token
     */
    public function getUserByTokenAction($token)
    {
        $manager = $this->get('fos_user.user_manager');

        /** @var \AppBundle\Entity\User $user */
        $user = $manager->findUserByConfirmationToken($token);

        if ($user == null) {
            $data = $this->get('serializer')->serialize(null, 'json');
        } else {
            $data = $this->get('serializer')->serialize($user, 'json');
        }

        return new Response($data, 200, ['Content-Type' => 'application/json']);
    }

    /**
     * @Route("/")
     * @Method("POST")
     *
     * Adds a new user
     */
    public function addUserAction(Request $request)
    {
        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();

        $tokenGenerator = $this->get('fos_user.util.token_generator');
        $token = $tokenGenerator->generateToken();

        $user = new User();
        $user->setUsername($content->username);
        $user->setRealName($content->real_name);
        $user->setCwid($content->cwid);
        $user->setEmail($content->email . '@agfa.com');
        $user->setEnabled(true);

//        Logic for password? maybe use token?
        $user->setPlainPassword('Agfa');
        $user->setLastLogin(null);
        $user->setConfirmationToken($token);
        $user->setCredentialsExpired(true);

        $countByUsername = count($em->getRepository('AppBundle:User')->findBy(array("username" => $user->getUsername())));
        $countByEmail = count($em->getRepository('AppBundle:User')->findBy(array("email" => $user->getEmail())));

        if ($countByUsername > 0 || $countByEmail > 0) {
            $data = $this->get('serializer')->serialize(array("result" => false), 'json');
            return new Response($data, 200, ['Content-type' => 'application/json']);
        }

        $team = $em->getRepository('AppBundle:Team')->find($content->team->id);
        $role = $em->getRepository('AppBundle:Role')->find($content->role->id);

        $user->setTeamFk($team);
        $user->setRoleFk($role);

        $em->persist($user);
        $em->flush();

        $message = \Swift_Message::newInstance()
            ->setSubject('Deimos - Welcome to Deimos')
            ->setFrom('noreply@agfa.com')
            ->setTo($user->getEmail())
            ->setBody(
                $this->renderView('emails/new-user.html.twig', array("user" => $user, "token" => $token)), 'text/html'
            );

        $this->get('mailer')->send($message);

        $data = $this->get('serializer')->serialize(array("result" => true), 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/update/")
     * @Method("PUT")
     *
     * Updates a users info
     */
    public function updateAction(Request $request)
    {
        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('AppBundle:User')->find($content->id);

        $user->setUsername($content->username);
        $user->setRealName($content->real_name);
        $user->setCwid($content->cwid);
        $user->setEmail($content->email  . "@agfa.com");
        

        if ($content->username != $user->getUsername()) {
            $countByUsername = count($em->getRepository('AppBundle:User')->findBy(array("username" => $user->getUsername())));

            if ($countByUsername > 0) {
                $data = $this->get('serializer')->serialize(array("result" => false), 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }
        }

        if ($content->email."@agfa.com" != $user->getEmail()) {
            $countByEmail = count($em->getRepository('AppBundle:User')->findBy(array("email" => $user->getEmail())));

            if ($countByEmail > 0) {
                $data = $this->get('serializer')->serialize(array("result" => false), 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }
        }

        // check if role is altered
        if ($content->newRole != $user->getRoleFk()->getId()) {
            $role = $em->getRepository('AppBundle:Role')->find($content->newRole);

            $user->setRoleFk($role);
        }

        // check if team is altered
        if ($content->newTeam != $user->getTeamFk()->getId()) {
            $team = $em->getRepository('AppBundle:Team')->find($content->newTeam);

            $user->setTeamFk($team);
        }

        $manager = $this->get('fos_user.user_manager');
        $manager->updateUser($user);

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/update-role/")
     * @Method("PUT")
     *
     * Updates a role
     */
    public function updateRoleAction(Request $request)
    {
        $content = json_decode($request->getContent());

        $manager = $this->get('fos_user.user_manager');
        /** @var \AppBundle\Entity\User $user */
        $user = $manager->findUserBy(array("id" => $content->id));

        $role = $this->getDoctrine()->getManager()->getRepository('AppBundle:Role')->find($content->newRole);

        $user->setRoleFk($role);
        $manager->updateUser($user);

        $data = $this->get('serializer')->serialize(["result" => "success"], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }


    /**
     * @Route("/{id}")
     * @Method("POST")
     *
     * Disables a user
     */
    public function disableAction(User $user) {
        $em = $this->getDoctrine()->getManager();

        $user->setEnabled(false);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => true], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/team/{id}")
     * @Method("GET")
     *
     * Get users by team
     */
    public function findUserByTeamAction(Team $team, Request $request)
    {
        $content = $request->getQueryString();
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:User");

        if($content != null) {
            $users = $repository->findBy(array('teamFk' => $team, 'enabled' => true));
        } else {
            $users = $repository->findBy(array('teamFk' => $team, 'enabled' => true, "plannable" => true));
        }

        $data = $this->get('serializer')->serialize($users, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}