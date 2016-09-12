<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ShiftType
 *
 * @ORM\Table(name="shift_type")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ShiftTypeRepository")
 */
class ShiftType
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
     * @ORM\Column(name="default_start_time", type="time")
     */
    private $defaultStartTime;

    /**
     * @ORM\Column(name="default_end_time", type="time")
     */
    private $defaultEndTime;

    /**
     * @ORM\Column(name="wholeday", type="boolean")
     */
    private $wholeday;

    /**
     * @ORM\Column(name="shift_duration", type="float")
     */
    private $shiftDuration;

    /**
     * @ORM\Column(name="bread_duration", type="float")
     */
    private $breadDuration;

    /**
     * @ORM\Column(name="workhours_duration_h", type="float")
     */
    private $workhoursDurationH;

    /**
     * @ORM\Column(name="record_created_at", type="datetime")
     */
    private $recordCreatedAt;

    //TODO $record_created_by not a FK?

    /**
     * @ORM\Column(name="record_created_by", type="integer")
     */
    private $recordCreatedBy;

    /**
     * @ORM\Column(name="status", type="boolean")
     */
    private $status;

    /**
     * @ORM\Column(name="team", type="integer")
     */
    private $team;

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
     * @return ShiftType
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
     * @return ShiftType
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
     * Set defaultStartTime
     *
     * @param \DateTime $defaultStartTime
     *
     * @return ShiftType
     */
    public function setDefaultStartTime($defaultStartTime)
    {
        $this->defaultStartTime = $defaultStartTime;

        return $this;
    }

    /**
     * Get defaultStartTime
     *
     * @return \DateTime
     */
    public function getDefaultStartTime()
    {
        return $this->defaultStartTime;
    }

    /**
     * Set defaultEndTime
     *
     * @param \DateTime $defaultEndTime
     *
     * @return ShiftType
     */
    public function setDefaultEndTime($defaultEndTime)
    {
        $this->defaultEndTime = $defaultEndTime;

        return $this;
    }

    /**
     * Get defaultEndTime
     *
     * @return \DateTime
     */
    public function getDefaultEndTime()
    {
        return $this->defaultEndTime;
    }

    /**
     * Set wholeday
     *
     * @param boolean $wholeday
     *
     * @return ShiftType
     */
    public function setWholeday($wholeday)
    {
        $this->wholeday = $wholeday;

        return $this;
    }

    /**
     * Get wholeday
     *
     * @return boolean
     */
    public function getWholeday()
    {
        return $this->wholeday;
    }

    /**
     * Set shiftDuration
     *
     * @param float $shiftDuration
     *
     * @return ShiftType
     */
    public function setShiftDuration($shiftDuration)
    {
        $this->shiftDuration = $shiftDuration;

        return $this;
    }

    /**
     * Get shiftDuration
     *
     * @return float
     */
    public function getShiftDuration()
    {
        return $this->shiftDuration;
    }

    /**
     * Set breadDuration
     *
     * @param float $breadDuration
     *
     * @return ShiftType
     */
    public function setBreadDuration($breadDuration)
    {
        $this->breadDuration = $breadDuration;

        return $this;
    }

    /**
     * Get breadDuration
     *
     * @return float
     */
    public function getBreadDuration()
    {
        return $this->breadDuration;
    }

    /**
     * Set workhoursDurationH
     *
     * @param float $workhoursDurationH
     *
     * @return ShiftType
     */
    public function setWorkhoursDurationH($workhoursDurationH)
    {
        $this->workhoursDurationH = $workhoursDurationH;

        return $this;
    }

    /**
     * Get workhoursDurationH
     *
     * @return float
     */
    public function getWorkhoursDurationH()
    {
        return $this->workhoursDurationH;
    }

    /**
     * Set recordCreatedAt
     *
     * @param \DateTime $recordCreatedAt
     *
     * @return ShiftType
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
     * @return ShiftType
     */
    public function setRecordCreatedBy($recordCreatedBy)
    {
        $this->recordCreatedBy = $recordCreatedBy;

        return $this;
    }

    /**
     * Get recordCreatedBy
     *
     * @return integer
     */
    public function getRecordCreatedBy()
    {
        return $this->recordCreatedBy;
    }

    /**
     * Set status
     *
     * @param boolean $status
     *
     * @return ShiftType
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return boolean
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set team
     *
     * @param integer $team
     *
     * @return ShiftType
     */
    public function setTeam($team)
    {
        $this->team = $team;

        return $this;
    }

    /**
     * Get team
     *
     * @return integer
     */
    public function getTeam()
    {
        return $this->team;
    }
}
