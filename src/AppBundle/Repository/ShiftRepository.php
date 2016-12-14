<?php

namespace AppBundle\Repository;

use Doctrine\DBAL\Connection;

class ShiftRepository extends \Doctrine\ORM\EntityRepository
{
    public function findPlanning($firstDate, $lastDate, $teamId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb->select(array('s.id', 's.description', 's.startTime', 's.endTime', 's.date', 's.home', 'u.id as userId', 'u.username', 'u.realName', 'tm.id as team_fk', 'st.id as shiftTypeId', 'st.short as shiftTypeShort', 'st.color as shiftColor', 't.id as taskId', 't.description as taskDescription', 't.url as taskUrl', 't.startTime as taskStartTime', 't.endTime as taskEndTime'))
            ->from('AppBundle:Shift', 's')
            ->leftJoin('s.userFk', 'u', 'WITH', 's.userFk = u.id')
            ->leftJoin('s.shiftTypeFk', 'st', 'WITH', 's.shiftTypeFk = st.id')
            ->leftJoin('AppBundle:Task', 't', 'WITH', 't.shiftFk = s.id')
            ->leftJoin('AppBundle:Team', 'tm', 'WITH', 'u.teamFk = tm.id')
            ->where('s.date BETWEEN :firstDate AND :lastDate')
            ->andWhere('tm.id = :teamId')
            ->andWhere('u.enabled = 1')
            ->addOrderBy('s.id')
            ->addOrderBy('t.startTime', 'ASC')
            ->addOrderBy('t.endTime', 'ASC')
            ->setParameter('firstDate', $firstDate)
            ->setParameter('lastDate', $lastDate)
            ->setParameter('teamId', $teamId);

        return $qb->getQuery()->getResult();
    }

    public function findShiftsByUser($userId, $date)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb->select(array('s.id', 's.date'))
            ->from('AppBundle:Shift', 's')
            ->where('s.userFk = :userId')
            ->andWhere('s.date >= :date')
            ->setParameter('userId', $userId)
            ->setParameter('date', $date->format("Y-m-d"));

        return $qb->getQuery()->getResult();
    }

//     Do not delete this yet
    public function findShiftsByUserAndDate($userId, $date)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb->select(array('s.id', 's.date'))
            ->from('AppBundle:Shift', 's')
            ->where('s.userFk = :userId')
            ->andWhere('s.date = :date')
            ->setParameter('userId', $userId)
            ->setParameter('date', $date->format("Y-m-d"));

        return $qb->getQuery()->getResult();
    }


}
