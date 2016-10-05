<?php

namespace AppBundle\Repository;

use Doctrine\DBAL\Connection;

class ShiftRepository extends \Doctrine\ORM\EntityRepository
{
    public function findPlanning($firstDate, $lastDate, $teamId)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

//        $qb->select(array('s.id', 's.description', 's.startTime', 's.endTime', 's.date', 'u.id as userId', 'u.username', 'u.realName', 'st.id as shiftTypeId', 'st.short as shiftTypeShort', 't.id as taskId', 't.description as taskDescription', 't.startTime as taskStartTime', 't.endTime as taskEndTime'))
//            ->from('AppBundle:Shift', 's')
//            ->leftJoin('s.userFk', 'u', 'WITH', 's.userFk = u.id')
//            ->leftJoin('s.shiftTypeFk', 'st', 'WITH', 's.shiftTypeFk = st.id')
//            ->leftJoin('AppBundle:Task', 't', 'WITH', 't.shiftFk = s.id')
//            ->where('s.date BETWEEN :firstDate AND :lastDate')
//            ->setParameter('firstDate', $firstDate)
//            ->setParameter('lastDate', $lastDate);

        $qb->select(array('s.id', 's.description', 's.startTime', 's.endTime', 's.date', 'u.id as userId', 'u.username', 'u.realName', 'tm.id as team_fk', 'st.id as shiftTypeId', 'st.short as shiftTypeShort', 't.id as taskId', 't.description as taskDescription', 't.startTime as taskStartTime', 't.endTime as taskEndTime'))
            ->from('AppBundle:Shift', 's')
            ->leftJoin('s.userFk', 'u', 'WITH', 's.userFk = u.id')
            ->leftJoin('s.shiftTypeFk', 'st', 'WITH', 's.shiftTypeFk = st.id')
            ->leftJoin('AppBundle:Task', 't', 'WITH', 't.shiftFk = s.id')
            ->leftJoin('AppBundle:Team', 'tm', 'WITH', 'u.teamFk = tm.id')
            ->where('s.date BETWEEN :firstDate AND :lastDate')
            ->andWhere('tm.id = :teamId')
            ->addOrderBy('s.id')
            ->addOrderBy('t.startTime', 'ASC')
            ->setParameter('firstDate', $firstDate)
            ->setParameter('lastDate', $lastDate)
            ->setParameter('teamId', $teamId)
        ;

        return $qb->getQuery()->getResult();
    }




}
