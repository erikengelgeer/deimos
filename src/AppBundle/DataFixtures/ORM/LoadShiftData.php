<?php
/**
 * Created by PhpStorm.
 * User: EAETV
 * Date: 12/09/2016
 * Time: 11:31
 */

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Shift;

class LoadShiftData extends AbstractFixture implements OrderedFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $user = $manager->getRepository('AppBundle:User')->findOneBy(array('username' => 'admin'));
        $shiftType = $manager->getRepository('AppBundle:ShiftType')->findOneBy(array('short' => 'N'));

        $shift1 = new Shift();
        $shift1->setDescription('QueueManager');
        $shift1->setDate(new \DateTime());
        $shift1->setStartTime(new \DateTime());
        $shift1->setEndTime(new \DateTime());
        $shift1->setShiftTypeFk($shiftType);
        $shift1->setUserFk($user);
        
        
        $manager->persist($shift1);
        $manager->flush();
    }

    public function getOrder()
    {
        return 7;
    }
}