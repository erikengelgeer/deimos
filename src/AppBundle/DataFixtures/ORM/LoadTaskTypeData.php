<?php

namespace AppBundle\DataFixtures\ORM;

use AppBundle\Entity\TaskType;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class LoadTaskTypeData extends AbstractFixture implements OrderedFixtureInterface
{

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $taskType = new TaskType();
        $taskType->setShort('create');
        $taskType->setDescription('create');

        $taskType1 = new TaskType();
        $taskType1->setShort('Meeting');
        $taskType1->setDescription('Meeting Deimos');

        $manager->persist($taskType);
        $manager->persist($taskType1);
        $manager->flush();
    }

    public function getOrder()
    {
        return 3;
    }
}