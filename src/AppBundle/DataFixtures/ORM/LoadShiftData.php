<?php
/**
 * Created by PhpStorm.
 * User: EAETV
 * Date: 12/09/2016
 * Time: 11:31
 */

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Shift;

class LoadShiftData implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $shift1 = new Shift();
        $shift1->setDescription('QueueManager');
        $shift1->setDate(new \DateTime());
        $shift1->setStartTime(new \DateTime());
        $shift1->setEndTime(new \DateTime());

        
        
        $manager->persist($shift1);
        $manager->flush();

    }
}