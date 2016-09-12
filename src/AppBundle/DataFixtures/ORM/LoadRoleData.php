<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Role;

class LoadRoleData implements FixtureInterface {

    public function load(ObjectManager $manager) {
        $role1 = new Role();
        $role2 = new Role();
        $role3 = new Role();
        $role4 = new Role();

        $role1->setRole('Administrator');
        $role1->setRoleDescription('Global Administrator');

        $role2->setRole('Manager');
        $role2->setRoleDescription('Manager');

        $role3->setRole('Planner');
        $role3->setRoleDescription('Planner');

        $role4->setRole('Agent');
        $role4->setRoleDescription('Agent');

        $manager->persist($role1);
        $manager->persist($role2);
        $manager->persist($role3);
        $manager->persist($role4);
        $manager->flush();
    }
}