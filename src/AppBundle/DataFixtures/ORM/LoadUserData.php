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

        $user = new User();
        $user->setUsername('admin');
        $user->setPlainPassword('test');
        $user->setRealName('Erik');
        $user->setEmail('admin@local.host');
        $user->setEnabled(true);
        $user->setLocked(false);
        $user->setExpired(false);
        $user->setTeamFk($team);

        $manager->persist($user);
        $manager->flush();
    }

    public function getOrder()
    {
        return 5;
    }
}