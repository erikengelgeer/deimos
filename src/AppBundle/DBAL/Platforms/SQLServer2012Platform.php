<?php

namespace AppBundle\DBAL\Platforms;

class SQLServer2012Platform extends \Doctrine\DBAL\Platforms\SQLServer2012Platform
{
    public function getDateTimeTypeDeclarationSQL(array $fieldDeclaration)
    {
        return "DATETIME";
    }

    public function getDateTimeFormatString()
    {
        return "Y-m-d H:i:s.000";
    }
}
