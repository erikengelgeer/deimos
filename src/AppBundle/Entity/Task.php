<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Task
 *
 * @ORM\Table(name="dbo.tasks")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TaskRepository")
 */
class Task
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
     * @var \datetime
     *
     * @ORM\Column(name="start_time", type="time")
     */
    private $startTime;

    /**
     * @var /datetime
     *
     * @ORM\Column(name="end_time", type="time")
     */
    private $endTime;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string")
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity="Shift")
     * @ORM\JoinColumn(name="shift_fk", referencedColumnName="pk")
     *
     */
    private $shiftFk;

    /**
     * @ORM\ManyToOne(targetEntity="TaskType")
     * @ORM\JoinColumn(name="task_type_fk", referencedColumnName="pk")
     */
    private $taskTypeFk;

    /**
     * @var string
     *
     * @ORM\Column(name="url", type="string")
     */
    private $url;

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
     * Set startTime
     *
     * @param \DateTime $startTime
     *
     * @return Task
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
     * @return Task
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
     * Set description
     *
     * @param string $description
     *
     * @return Task
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
     * Set shiftFk
     *
     * @param \AppBundle\Entity\Shift $shiftFk
     *
     * @return Task
     */
    public function setShiftFk(\AppBundle\Entity\Shift $shiftFk = null)
    {
        $this->shiftFk = $shiftFk;

        return $this;
    }

    /**
     * Get shiftFk
     *
     * @return \AppBundle\Entity\Shift
     */
    public function getShiftFk()
    {
        return $this->shiftFk;
    }

    /**
     * Set taskTypeFk
     *
     * @param \AppBundle\Entity\TaskType $taskTypeFk
     *
     * @return Task
     */
    public function setTaskTypeFk(\AppBundle\Entity\TaskType $taskTypeFk = null)
    {
        $this->taskTypeFk = $taskTypeFk;

        return $this;
    }

    /**
     * Get taskTypeFk
     *
     * @return \AppBundle\Entity\TaskType
     */
    public function getTaskTypeFk()
    {
        return $this->taskTypeFk;
    }

    /**
     * Set url
     *
     * @param string $url
     *
     * @return Task
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get url
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }
}
