<?php
/**
 * Created by PhpStorm.
 * User: edrbu
 * Date: 9/09/2016
 * Time: 10:16
 */

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;


/**
 * User
 *
 * @ORM\Table(name="dbo.users")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 */
class User extends BaseUser
{
    /**
     * @var int
     *
     * @ORM\Column(name="pk", type="bigint")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(name="real_name", type="string")
     */
    private $realName;

    /**
     * @ORM\Column(name="plannable", type="boolean")
     */
    private $plannable = true;

    /**
     * @ORM\ManyToOne(targetEntity="Team")
     * @ORM\JoinColumn(name="team_fk", referencedColumnName="pk")
     */
    private $teamFk;

    /**
     * @ORM\ManyToOne(targetEntity="Role")
     * @ORM\JoinColumn(name="role_fk", referencedColumnName="pk")
     */
    private $roleFk;

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
     * Set realName
     *
     * @param string $realName
     *
     * @return User
     */
    public function setRealName($realName)
    {
        $this->realName = $realName;

        return $this;
    }

    /**
     * Get realName
     *
     * @return string
     */
    public function getRealName()
    {
        return $this->realName;
    }

    /**
     * Set teamFk
     *
     * @param \AppBundle\Entity\Team $teamFk
     *
     * @return User
     */
    public function setTeamFk(\AppBundle\Entity\Team $teamFk = null)
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
     * Set roleFk
     *
     * @param \AppBundle\Entity\Role $roleFk
     *
     * @return User
     */
    public function setRoleFk(\AppBundle\Entity\Role $roleFk = null)
    {
        $this->roleFk = $roleFk;

        return $this;
    }

    /**
     * Get roleFk
     *
     * @return \AppBundle\Entity\Role
     */
    public function getRoleFk()
    {
        return $this->roleFk;
    }

    /**
     * Set plannable
     *
     * @param boolean $plannable
     *
     * @return User
     */
    public function setPlannable($plannable)
    {
        $this->plannable = $plannable;

        return $this;
    }

    /**
     * Get plannable
     *
     * @return boolean
     */
    public function getPlannable()
    {
        return $this->plannable;
    }
}
