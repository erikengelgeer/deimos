<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TaskType
 *
 * @ORM\Table(name="task_type")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TaskTypeRepository")
 */
class TaskType
{
    /**
     * @var int
     *
     * @ORM\Column(name="pk", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="short", type="string")
     */
    private $short;

    /**
     * @ORM\Column(name="description", type="string")
     */
    private $description;

    /**
     * @ORM\Column(name="record_created_at", type="datetime")
     */
    private $recordCreatedAt;

    /**
     * @ORM\Column(name="record_created_by", type="integer")
     */
    private $recordCreatedBy;

    /**
     * @ORM\Column(name="status", type="string")
     */
    private $status;


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
     * Set short
     *
     * @param string $short
     *
     * @return TaskType
     */
    public function setShort($short)
    {
        $this->short = $short;

        return $this;
    }

    /**
     * Get short
     *
     * @return string
     */
    public function getShort()
    {
        return $this->short;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return TaskType
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
     * Set recordCreatedAt
     *
     * @param \DateTime $recordCreatedAt
     *
     * @return TaskType
     */
    public function setRecordCreatedAt($recordCreatedAt)
    {
        $this->recordCreatedAt = $recordCreatedAt;

        return $this;
    }

    /**
     * Get recordCreatedAt
     *
     * @return \DateTime
     */
    public function getRecordCreatedAt()
    {
        return $this->recordCreatedAt;
    }

    /**
     * Set recordCreatedBy
     *
     * @param integer $recordCreatedBy
     *
     * @return TaskType
     */
    public function setRecordCreatedBy($recordCreatedBy)
    {
        $this->recordCreatedBy = $recordCreatedBy;

        return $this;
    }

    /**
     * Get recordCreatedBy
     *
     * @return \int
     */
    public function getRecordCreatedBy()
    {
        return $this->recordCreatedBy;
    }

    /**
     * Set status
     *
     * @param string $status
     *
     * @return TaskType
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }
}
