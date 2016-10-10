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

        $users = $repository->findBy(array("enabled" => true));

        $data = $this->get('serializer')->serialize($users, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/user")
     * @Method("GET")
     *
     * Gets the logged in user.
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
     * Updates a users password
     */
    public function updatePasswordAction(Request $request)
    {
        $data = $request->getContent();
        $user = $this->getUser();

        $user->setPlainPassword($data);
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
        $email = $request->getContent();

        $manager = $this->get('fos_user.user_manager');
        /** @var \AppBundle\Entity\User $user */
        $user = $manager->findUserByEmail($email);

        $tokenGenerator = $this->get('fos_user.util.token_generator');
        $token = $tokenGenerator->generateToken();

        $user->setLastLogin(null);
        $user->setConfirmationToken($token);
        $user->setCredentialsExpired(true);

        $manager->updateUser($user);

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
        $data = json_decode($request->getContent());

        $manager = $this->get('fos_user.user_manager');
        $user = $manager->findUserByConfirmationToken($data->confirmation_token);

        $user->setConfirmationToken(null);
        $user->setCredentialsExpired(false);
        $user->setPlainPassword($data->newPassword);

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
        $username = $request->getContent();

        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:User");

        $user = $repository->findOneBy(array("username" => $username));

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
        $data = json_decode($request->getContent());
        $user = $this->getUser();

        $user->setPlainPassword($data->password);
        $this->get('fos_user.user_manager')->updateUser($user);
    }

    /**
     * @Route("/token")
     * @Method("POST")
     * @param Request $request
     * @return Response
     */
    public function getUserByTokenAction(Request $request)
    {
        $token = $request->getContent();
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
        $data = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();
        dump($data);

        $user = new User();
        $user->setUsername($data->username);
        $user->setRealName($data->real_name);
        $user->setEmail($data->email);
        $user->setEnabled(true);

//        Logic for password? maybe use token?
        $user->setPlainPassword('test');

        $countByUsername = count($em->getRepository('AppBundle:User')->findBy(array("username" => $user->getUsername())));
        $countByEmail = count($em->getRepository('AppBundle:User')->findBy(array("email" => $user->getEmail())));

        if ($countByUsername > 0 || $countByEmail > 0) {
            $data = $this->get('serializer')->serialize(array("result" => false), 'json');
            return new Response($data, 200, ['Content-type' => 'application/json']);
        }

        $team = $em->getRepository('AppBundle:Team')->find($data->team->id);
        $role = $em->getRepository('AppBundle:Role')->find($data->role->id);

        $user->setTeamFk($team);
        $user->setRoleFk($role);

        $em->persist($user);
        $em->flush();
        dump($user);

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
        $data = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('AppBundle:User')->find($data->id);

        $user->setUsername($data->username);
        $user->setRealName($data->real_name);
        $user->setEmail($data->email);

        if ($data->username != $user->getUsername()) {
            $countByUsername = count($em->getRepository('AppBundle:User')->findBy(array("username" => $user->getUsername())));

            if ($countByUsername > 0) {
                $data = $this->get('serializer')->serialize(array("result" => false), 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }
        }

        if ($data->email != $user->getEmail()) {
            $countByEmail = count($em->getRepository('AppBundle:User')->findBy(array("email" => $user->getEmail())));

            if ($countByEmail > 0) {
                $data = $this->get('serializer')->serialize(array("result" => false), 'json');
                return new Response($data, 200, ['Content-type' => 'application/json']);
            }
        }

        // check if role is altered
        if ($data->newRole != $user->getRoleFk()->getId()) {
            $role = $em->getRepository('AppBundle:Role')->find($data->newRole);

            $user->setRoleFk($role);
        }

        // check if team is altered
        if ($data->newTeam != $user->getTeamFk()->getId()) {
            $team = $em->getRepository('AppBundle:Team')->find($data->newTeam);

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
     */
    public function disableAction(User $user) {
        $em = $this->getDoctrine()->getManager();

        $user->setEnabled(false);
        dump($user);

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
    public function findUserByTeamAction(Team $team)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository("AppBundle:User");

        $users = $repository->findBy(array('teamFk' => $team));

        $data = $this->get('serializer')->serialize($users, 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}