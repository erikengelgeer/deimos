<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ShiftType
 *
 * @ORM\Table(name="dbo.shift_types")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ShiftTypeRepository")
 */
class ShiftType
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
     * @ORM\Column(name="short", type="string")
     */
    private $short;

    /**
     * @ORM\Column(name="description", type="string")
     */
    private $description;

    /**
     * @ORM\Column(name="default_start_time", type="time", nullable=true)
     */
    private $defaultStartTime;

    /**
     * @ORM\Column(name="default_end_time", type="time", nullable=true)
     */
    private $defaultEndTime;

    /**
     * @ORM\Column(name="shift_duration", type="float")
     */
    private $shiftDuration;

    /**
     * @ORM\Column(name="break_duration", type="float")
     */
    private $breakDuration;

    /**
     * @ORM\Column(name="workhours_duration_h", type="float")
     */
    private $workhoursDurationH;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Team")
     * @ORM\JoinColumn(name="team_fk", referencedColumnName="pk")
     */
    private $teamFk;

    /**
     * @ORM\Column(name="enabled", type="boolean")
     */
    private $enabled = true;

    /**
     * @ORM\Column(name="color", type="string")
     */
    private $color;

    private $timezoneOffset;

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
     * Set teamFk
     *
     * @param \AppBundle\Entity\Team $teamFk
     *
     * @return ShiftType
     */
    public function setTeamFk(Team $teamFk = null)
    {
        $this->teamFk = $teamFk;

        return $this;
    }

    /**
     * Get teamFk
     *
     * @return \AppBundle\Entity\Team
     */
    public function getTeamFk()
    {
        return $this->teamFk;
    }

    /**
     * Set enabled
     *
     * @param boolean $enabled
     *
     * @return ShiftType
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;

        return $this;
    }

    /**
     * Get enabled
     *
     * @return boolean
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Set color
     *
     * @param string $color
     *
     * @return ShiftType
     */
    public function setColor($color)
    {
        $this->color = $color;

        return $this;
    }

    /**
     * Get color
     *
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set breakDuration
     *
     * @param float $breakDuration
     *
     * @return ShiftType
     */
    public function setBreakDuration($breakDuration)
    {
        $this->breakDuration = $breakDuration;

        return $this;
    }

    /**
     * Get breakDuration
     *
     * @return float
     */
    public function getBreakDuration()
    {
        return $this->breakDuration;
    }

    /**
     * @return mixed
     */
    public function getTimezoneOffset()
    {
        return $this->timezoneOffset;
    }

    /**
     * @param mixed $timezoneOffset
     * @return $this
     */
    public function setTimezoneOffset($timezoneOffset)
    {
        $this->timezoneOffset = $timezoneOffset;

        return $this;
    }
}
