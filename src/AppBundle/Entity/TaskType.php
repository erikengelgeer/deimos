<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TaskType
 *
 * @ORM\Table(name="dbo.task_types")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TaskTypeRepository")
 */
class TaskType
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
     * @ORM\Column(name="enabled", type="boolean")
     */
    private $enabled = true;

    /**
     * @ORM\Column(name="overrideDescription", type="boolean")
     */
    private $overrideDescription = false;


    /**
     * Get id
     *
     * @return integer
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
     * Set enabled
     *
     * @param boolean $enabled
     *
     * @return TaskType
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
     * Set overrideDescription
     *
     * @param boolean $overrideDescription
     *
     * @return TaskType
     */
    public function setOverrideDescription($overrideDescription)
    {
        $this->overrideDescription = $overrideDescription;

        return $this;
    }

    /**
     * Get overrideDescription
     *
     * @return boolean
     */
    public function getOverrideDescription()
    {
        return $this->overrideDescription;
    }
}
