<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Task;

class LoadTaskData implements FixtureInterface
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
}