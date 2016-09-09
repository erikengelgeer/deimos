<?php
/**
 * Created by PhpStorm.
 * User: edrbu
 * Date: 9/09/2016
 * Time: 10:16
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * User
 *
 * @ORM\Table(name="users")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 */
class User
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
     * @ORM\Column(name="real_name", type="string")
     */
    private $realName;

    /**
     * @ORM\OneToOne(targetEntity="Team")
     * @ORM\JoinColumn(name="user_pk", referencedColumnName="pk")
     */
    private $teamFk;

    /**
     * @ORM\ManyToOne(targetEntity="Role")
     * @ORM\JoinColumn(name="user_pk", referencedColumnName="pk")
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
}
