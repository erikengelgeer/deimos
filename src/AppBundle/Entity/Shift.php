<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\Task;
/**
 * Shift
 *
 * @ORM\Table(name="dbo.shifts")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ShiftRepository")
 */
class Shift
{
    /**
     * @var int
     *
     * @ORM\Column(name="pk", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string")
     */
    private $description;

    /**
     * @var \datetime
     *
     * @ORM\Column(name="start_time", type="time")
     */
    private $startTime;

    /**
     * @var \datetime
     *
     * @ORM\Column(name="end_time", type="time")
     */
    private $endTime;

    /**
     * @var \datetime
     *
     * @ORM\Column(name="date", type="date")
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity="ShiftType")
     * @ORM\JoinColumn(name="shift_type_fk", referencedColumnName="pk")
     */
    private $shiftTypeFk;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="user_fk", referencedColumnName="pk")
     */
    private $userFk;

    /**
     * @ORM\OneToMany(targetEntity="Task", mappedBy="shiftFk")
     */
    private $tasks;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Shift
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set startTime
     *
     * @param \DateTime $startTime
     *
     * @return Shift
     */
    public function setStartTime($startTime)
    {
        $this->startTime = $startTime;

        return $this;
    }

    /**
     * Get startTime
     *
     * @return \DateTime
     */
    public function getStartTime()
    {
        return $this->startTime;
    }

    /**
     * Set endTime
     *
     * @param \DateTime $endTime
     *
     * @return Shift
     */
    public function setEndTime($endTime)
    {
        $this->endTime = $endTime;

        return $this;
    }

    /**
     * Get endTime
     *
     * @return \DateTime
     */
    public function getEndTime()
    {
        return $this->endTime;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return Shift
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set shiftTypeFk
     *
     * @param \AppBundle\Entity\ShiftType $shiftTypeFk
     *
     * @return Shift
     */
    public function setShiftTypeFk(\AppBundle\Entity\ShiftType $shiftTypeFk = null)
    {
        $this->shiftTypeFk = $shiftTypeFk;

        return $this;
    }

    /**
     * Get shiftTypeFk
     *
     * @return \AppBundle\Entity\ShiftType
     */
    public function getShiftTypeFk()
    {
        return $this->shiftTypeFk;
    }

    /**
     * Set userFk
     *
     * @param \AppBundle\Entity\User $userFk
     *
     * @return Shift
     */
    public function setUserFk(\AppBundle\Entity\User $userFk = null)
    {
        $this->userFk = $userFk;

        return $this;
    }

    /**
     * Get userFk
     *
     * @return \AppBundle\Entity\User
     */
    public function getUserFk()
    {
        return $this->userFk;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->tasks = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add task
     *
     * @param \AppBundle\Entity\Task $task
     *
     * @return Shift
     */
    public function addTask(\AppBundle\Entity\Task $task)
    {
        $this->tasks[] = $task;

        return $this;
    }

    /**
     * Remove task
     *
     * @param \AppBundle\Entity\Task $task
     */
    public function removeTask(\AppBundle\Entity\Task $task)
    {
        $this->tasks->removeElement($task);
    }

    /**
     * Get tasks
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTasks()
    {
        return $this->tasks;
    }
}
