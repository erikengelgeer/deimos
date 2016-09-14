<?php

namespace AppBundle\Repository;

use Doctrine\DBAL\Connection;

class ShiftRepository extends \Doctrine\ORM\EntityRepository
{
    public function findPlanning() {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb->select(array('s.id', 's.description', 's.startTime', 's.endTime', 's.date', 'u.id as userId', 'u.username', 'u.realName', 'st.id as shiftTypeId', 'st.short as shiftTypeShort', 't.id as taskId', 't.description as taskDescription', 't.startTime as taskStartTime', 't.endTime as taskEndTime'))
            ->from('AppBundle:Shift', 's')
            ->leftJoin('s.userFk', 'u', 'WITH', 's.userFk = u.id')
            ->leftJoin('s.shiftTypeFk', 'st', 'WITH', 's.shiftTypeFk = st.id')
            ->leftJoin('AppBundle:Task', 't', 'WITH', 't.shiftFk = s.id')
            ;

        return $qb->getQuery()->getResult();
    }

}
