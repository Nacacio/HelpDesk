package com.br.helpdesk.repository;

import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 * Date: 13/10/13
 * Time: 09:07
 * To change this template use File | Settings | File Templates.
 */
public interface TicketRepository extends CrudRepository<Ticket,Long> {
    List<Ticket> findByIsOpen(Boolean isOpen);
    List<Ticket> findByIsOpen(Boolean isOpen,Pageable pageable);
    List<Ticket> findByIsOpenAndUser(Boolean isOpen,User user);
    List<Ticket> findByUser(User user);
    List<Ticket> findByUser(User user,Pageable pageable);
    List<Ticket> findByResponsavelAndIsOpen(User user,Boolean isOpen);
    List<Ticket> findByResponsavelAndIsOpen(User user,Boolean isOpen,Pageable pageable);
    Page<Ticket> findAll(Pageable pageable);

    @Query(
            "Select t FROM Ticket t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
                    "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
    )
    public List<Ticket> search(@Param("searchTerm") String searchTerm);

    @Query(
            "Select count(t) FROM Ticket t WHERE t.user.id= :userId"
    )
    public Long getTicketsPerUser(@Param("userId") Long userId);

    @Query(
            "Select t FROM Ticket t WHERE (t.startDate is not null) and (t.startDate between :startDate_1 and :startDate_2) and (t.endDate is not null) and (t.endDate between :endDate_1 and :endDate_2)"
    )
    public List<Ticket> findBetweenDates(@Param("startDate_1")Date startDate_1,@Param("startDate_2")Date startDate_2,@Param("endDate_1")Date endDate_1,@Param("endDate_2")Date endDate_2);

    @Query(
            "Select t FROM Ticket t WHERE (t.startDate is not null) and (t.startDate between :firstDate and :lastDate)"
    )
    public List<Ticket> findBetweenStartDate(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);

    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is not null) and (t.endDate between :firstDate and :lastDate)"
    )
    public List<Ticket> findBetweenEndDate(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);

    @Query(
            "Select t FROM Ticket t WHERE (t.endDate is null) and (t.startDate <= :lastDate)"
    )
    public List<Ticket> findIsOpenUntilDate(@Param("lastDate") Date lastDate);
}
