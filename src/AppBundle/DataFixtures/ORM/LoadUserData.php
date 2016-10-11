<?php

namespace  AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\User;

class LoadUserData extends AbstractFixture implements OrderedFixtureInterface
{
    public function load(ObjectManager $manager)
    {

        $team = $manager->getRepository('AppBundle:Team')->findOneBy(array('name' => 'GRIP RIJSWIJK'));
        $roleAgent = $manager->getRepository('AppBundle:Role')->findOneBy(array('role' => 'Agent'));
        $roleAdmin = $manager->getRepository('AppBundle:Role')->findOneBy(array('role' => 'Administrator'));

        $user1 = new User();
        $user2 = new User();

        $user1->setUsername('admin');
        $user1->setPlainPassword('test');
        $user1->setRealName('Erik');
        $user1->setEmail('erik.engelgeer@agfa.com');
        $user1->setEnabled(true);
        $user1->setLocked(false);
        $user1->setExpired(false);
        $user1->setTeamFk($team);
        $user1->setRoleFk($roleAdmin);

        $user2->setUsername('user');
        $user2->setPlainPassword('null');
        $user2->setRealName('Nick');
        $user2->setEmail('danny.nieuwmans@agfa.com');
        $user2->setEnabled(true);
        $user2->setLocked(false);
        $user2->setExpired(false);
        $user2->setTeamFk($team);
        $user2->setRoleFk($roleAgent);

        $manager->persist($user1);
        $manager->persist($user2);
        $manager->flush();
    }

    public function getOrder()
    {
        return 5;
    }
}