<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Team;

class LoadTeamData implements FixtureInterface {

    public function load(ObjectManager $manager) {
        $team = new Team();

        $team->setShort('LDS');
        $team->setName('RSN LEEDS');
        $team->setLocation('GBR');
        $team->setTimezone('Europe/London');

        $manager->persist($team);
        $manager->flush();
    }
}