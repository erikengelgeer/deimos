<?php

namespace AppBundle\Controller\Api;

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

        $users = $repository->findAll();

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
     * @Route("/")
     * @Method("POST")
     *
     * Adds a new user
     */
    public function addUserAction()
    {
        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/update/")
     * @Method("PUT")
     *
     * Updates a users info
     */
    public function updateAction(Request $request) {
        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('AppBundle:User')->find($content->id);
        $role = $em->getRepository('AppBundle:Role')->findOneBy(array('id' => $content->role_fk->id));
        $team = $em->getRepository('AppBundle:Team')->findOneBy(array('id' => $content->team_fk->id));

        dump($role);
        $user->setRealName($content->real_name);
        $user->setUsername($content->username);
        $user->setEmail($content->email);
        $user->setRoleFk($role);
        $user->setTeamFk($team);

        $this->get('fos_user.user_manager')->updateUser($user, false);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => "success"], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/updateRole/")
     * @Method("PUT")
     */
    public function updateRoleAction(Request $request ) {
        dump($request->getContent());
        $content = json_decode($request->getContent());
        $em = $this->getDoctrine()->getManager();
        dump($content);
        $user = $em->getRepository('AppBundle:User')->findOneBy(array('id' => $content->id));
        $role = $em->getRepository('AppBundle:Role')->findOneBy(array('id' => $content->role_fk->id));

        $user->setRoleFk($role);
        $this->get('fos_user.user_manager')->updateUser($user, false);

        $em->flush();

        $data = $this->get('serializer')->serialize(["result" => "success"], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/update/password")
     * @Method("POST")
     *
     * Updates a users password
     */
    public function updatePasswordAction()
    {
        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/delete/{id}")
     * @Method("POST")
     *
     * Deletes a certain user
     */
    public function deleteUserAction()
    {
        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }

    /**
     * @Route("/request-password/{email}")
     * @Method("POST")
     *
     * Request password through email
     */
    public function requestPasswordAction()
    {
        $data = $this->get('serializer')->serialize([], 'json');
        return new Response($data, 200, ['Content-type' => 'application/json']);
    }
}