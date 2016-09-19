<?php
/**
 * Created by PhpStorm.
 * User: EAETV
 * Date: 12/09/2016
 * Time: 11:40
 */

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\ShiftType;
use Symfony\Component\Validator\Constraints\DateTime;


class LoadShiftTypeData extends AbstractFixture implements OrderedFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $shiftType1 = new ShiftType();
        $shiftType1->setShort('N');
        $shiftType1->setDescription('N');
        $shiftType1->setDefaultStartTime(new \DateTime());
        $shiftType1->setDefaultEndTime(new \DateTime());
        $shiftType1->setWholeday('Y');
        $shiftType1->setWorkhoursDurationH(8);
        $shiftType1->setBreadDuration(0.5);
        $shiftType1->setShiftDuration(8.5);
        $shiftType1->setRecordCreatedBy(1);
        $shiftType1->setRecordCreatedAt(new \datetime());
        $shiftType1->setTeam(1);
        $shiftType1->setStatus('ACTIVE');

        $shiftType2 = new ShiftType();
        $shiftType2->setShort('B');
        $shiftType2->setDescription('B');
        $shiftType2->setDefaultStartTime(new \DateTime());
        $shiftType2->setDefaultEndTime(new \DateTime());
        $shiftType2->setWholeday('Y');
        $shiftType2->setWorkhoursDurationH(8);
        $shiftType2->setBreadDuration(0.5);
        $shiftType2->setShiftDuration(8.5);
        $shiftType2->setRecordCreatedBy(1);
        $shiftType2->setRecordCreatedAt(new \datetime());
        $shiftType2->setTeam(1);
        $shiftType2->setStatus('ACTIVE');
        

        $manager->persist($shiftType1);
        $manager->persist($shiftType2);
        $manager->flush();
    }

    public function getOrder()
    {
        return 4;
    }
}