<?php

namespace  AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\User;

class LoadUserData implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setUsername('admin');
        $user->setPlainPassword('test');
        $user->setRealName('Erik');
        $user->setEmail('admin@local.host');
        $user->setEnabled(true);
        $user->setLocked(false);
        $user->setExpired(false);

        $manager->persist($user);
        $manager->flush();
    }
}