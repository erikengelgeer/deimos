<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Team;

class LoadTeamData implements FixtureInterface {

    public function load(ObjectManager $manager) {

        $team1 = new Team();
        $team2 = new Team();
        $team3 = new Team();

        $team1->setShort('RWK');
        $team1->setName('GRIP RIJSWIJK');
        $team1->setLocation('NLD');
        $team1->setTimezone('Europe/Amsterdam');

        $team2->setShort('WIL');
        $team2->setName('GRIP WATERLOO');
        $team2->setLocation('CAN');
        $team2->setTimezone('America/Toronto');

        $team3->setShort('LDS');
        $team3->setName('RSN LEEDS');
        $team3->setLocation('GBR');
        $team3->setTimezone('Europe/London');

        $manager->persist($team1);
        $manager->persist($team2);
        $manager->persist($team3);
        $manager->flush();
    }
}