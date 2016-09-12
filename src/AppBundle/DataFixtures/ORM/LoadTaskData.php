<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Task;

class LoadTaskData extends AbstractFixture implements OrderedFixtureInterface
{

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $task = new Task();
        $task->setDescription('Test Task');
        $task->setDate(new \DateTime());
        $task->setStartTime(new \DateTime());
        $task->setEndTime(new \DateTime());

        $manager->persist($task);
        $manager->flush();
    }

    public function getOrder()
    {
        return 6;
    }
}